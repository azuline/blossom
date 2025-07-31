terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.45"
    }
  }
}

# ---------------- Variables ----------------

variable "project" { type = string }
variable "terraform_sa" { type = string }
variable "engineers_group" { type = string }
variable "environment" {
  type = string
  validation {
    condition     = contains(["production", "sandbox"], var.environment)
    error_message = "environment must be one of: production, sandbox"
  }
}

# ---------------- Provider ----------------

locals {
  region = "us-west1"
  zone   = "us-west1-a"
}
provider "google" {
  project                     = var.project
  region                      = local.region
  zone                        = local.zone
  impersonate_service_account = var.terraform_sa
}

# ---------------- Enable APIs ----------------

locals {
  apis = toset([
    "artifactregistry.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "compute.googleapis.com",
    "iam.googleapis.com",
    "iap.googleapis.com",
    "run.googleapis.com",
    "secretmanager.googleapis.com",
    "servicenetworking.googleapis.com",
    "sqladmin.googleapis.com",
  ])
}
resource "google_project_service" "apis" {
  for_each           = local.apis
  project            = var.project
  service            = each.key
  disable_on_destroy = false
}

# ---------------- Network ----------------

resource "google_compute_network" "primary" {
  name                    = "primary"
  auto_create_subnetworks = true
}

resource "google_compute_global_address" "primary_psa" {
  name          = "primary-psa-range"
  address_type  = "INTERNAL"
  purpose       = "VPC_PEERING"
  prefix_length = 16
  network       = google_compute_network.primary.id
}
resource "google_service_networking_connection" "primary_psa" {
  network                 = google_compute_network.primary.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.primary_psa.name]
}

resource "google_compute_router" "nat" {
  name    = "primary-nat-router"
  region  = local.region
  network = google_compute_network.primary.id
}
resource "google_compute_router_nat" "default" {
  name                               = "primary-nat"
  region                             = local.region
  router                             = google_compute_router.nat.name
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}

# ---------------- Service Accounts ----------------

locals {
  service_accounts = {
    god = {
      account_id    = "sa-god"
      display       = "Emergency break-glass"
      project_roles = ["roles/owner"]
    }
    product = {
      account_id    = "sa-product"
      display       = "Product service IAM login"
      project_roles = []
    }
    "tailscale_subnet_router" = {
      account_id = "sa-tailscale-subnet-router"
      display    = "Tailscale subnet router IAM login"
      project_roles = [
        "roles/logging.logWriter",
        "roles/monitoring.metricWriter",
      ]
    }
    golink = {
      account_id = "sa-golink"
      display    = "Golink service IAM login"
      project_roles = [
        "roles/artifactregistry.reader",
        "roles/logging.logWriter",
        "roles/monitoring.metricWriter",
      ]
    }
  }
}

resource "google_service_account" "sa" {
  for_each     = local.service_accounts
  account_id   = each.value.account_id
  display_name = each.value.display
}
resource "google_service_account_iam_member" "sa_impersonate" {
  for_each           = google_service_account.sa
  service_account_id = each.value.name
  role               = "roles/iam.serviceAccountTokenCreator"
  member             = "group:${var.engineers_group}"
}

resource "google_project_iam_member" "engineers_iap_tunnel" {
  project = var.project
  role    = "roles/iap.tunnelResourceAccessor"
  member  = "group:${var.engineers_group}"
}

locals {
  sa_project_role_pairs = flatten([
    for sak, cfg in local.service_accounts : [
      for r in coalesce(cfg.project_roles, []) : {
        sa_key = sak
        role   = r
      }
    ]
  ])
  sa_project_role_map = {
    for p in local.sa_project_role_pairs : "${p.sa_key}:${p.role}" => p
  }
}

resource "google_project_iam_member" "sa_roles" {
  for_each = local.sa_project_role_map
  project  = var.project
  role     = each.value.role
  member   = "serviceAccount:${google_service_account.sa[each.value.sa_key].email}"
}

# ---------------- Secrets ----------------

locals {
  secrets = toset([
    "ts-authkey",
  ])
  secret_grants = {
    ts-authkey = ["tailscale_subnet_router", "golink"]
  }
}

resource "google_secret_manager_secret" "secrets" {
  for_each  = local.secrets
  secret_id = each.key
  replication {
    auto {}
  }
}

locals {
  secret_grant_pairs = flatten([for sid, sa_keys in local.secret_grants : [for sak in sa_keys : { secret_id = sid, sa_key = sak }]])
  secret_grant_map   = { for p in local.secret_grant_pairs : "${p.secret_id}:${p.sa_key}" => p }
}
resource "google_secret_manager_secret_iam_member" "access" {
  for_each  = local.secret_grant_map
  secret_id = google_secret_manager_secret.secrets[each.value.secret_id].id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.sa[each.value.sa_key].email}"
}

# ---------------- Artifact Registry ----------------

resource "google_artifact_registry_repository" "ghcr_remote" {
  location      = local.region
  repository_id = "ghcr-remote"
  description   = "Remote repository for GitHub Container Registry"
  format        = "DOCKER"
  mode          = "REMOTE_REPOSITORY"
  remote_repository_config {
    description = "GitHub Container Registry remote"
    docker_repository {
      custom_repository {
        uri = "https://ghcr.io"
      }
    }
  }
}

# ---------------- IAP Access ----------------

resource "google_compute_firewall" "allow_iap" {
  name    = "allow-iap"
  network = google_compute_network.primary.name
  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
  source_ranges = ["35.235.240.0/20"]
  target_tags   = ["iap-access"]
}

# ---------------- Tailscale VPN ----------------

locals {
  tailscale_version = "1.86.2"
  psa_cidr          = "${google_compute_global_address.primary_psa.address}/${google_compute_global_address.primary_psa.prefix_length}"
}

# We use Tailscale to grant access to everything else (and perm through its
# ACL), but for accessing the tailscale instance we use IAP.
resource "google_compute_instance" "tailscale_subnet_router" {
  name                      = "tailscale-subnet-router"
  machine_type              = "e2-micro"
  tags                      = ["iap-access"]
  can_ip_forward            = true
  allow_stopping_for_update = true
  boot_disk {
    initialize_params { image = "debian-cloud/debian-12" }
  }
  network_interface {
    network = google_compute_network.primary.id
  }
  service_account {
    email  = google_service_account.sa["tailscale_subnet_router"].email
    scopes = ["cloud-platform"]
  }
  shielded_instance_config {
    enable_secure_boot          = true
    enable_vtpm                 = true
    enable_integrity_monitoring = true
  }
  metadata = {
    serial-port-enable         = "TRUE"
    serial-port-logging-enable = "TRUE"
    enable-oslogin             = "TRUE"
  }
  metadata_startup_script = <<-EOF
    #!/bin/bash
    set -euo pipefail

    sysctl -w net.ipv4.ip_forward=1
    sysctl -w net.ipv6.conf.all.forwarding=1

    curl -fsSL https://pkgs.tailscale.com/stable/debian/bookworm.noarmor.gpg | tee /usr/share/keyrings/tailscale-archive-keyring.gpg >/dev/null
curl -fsSL https://pkgs.tailscale.com/stable/debian/bookworm.tailscale-keyring.list | tee /etc/apt/sources.list.d/tailscale.list

    sudo apt-get update --yes
    sudo apt-get install --yes tailscale
    
    tailscale up \
      --authkey="$(gcloud secrets versions access latest --project="${var.project}" --secret="${google_secret_manager_secret.secrets["ts-authkey"].secret_id}")" \
      --advertise-routes="${local.psa_cidr}" \
      --hostname=gcloud \
      --timeout=30s
  EOF
}

resource "google_compute_instance" "golink" {
  name                      = "golink"
  machine_type              = "e2-micro"
  tags                      = ["iap-access"]
  allow_stopping_for_update = true
  boot_disk {
    initialize_params {
      image = "cos-cloud/cos-stable"
    }
  }
  network_interface {
    network = google_compute_network.primary.id
  }
  service_account {
    email  = google_service_account.sa["golink"].email
    scopes = ["cloud-platform"]
  }
  shielded_instance_config {
    enable_secure_boot          = true
    enable_vtpm                 = true
    enable_integrity_monitoring = true
  }
  metadata = {
    serial-port-enable         = "TRUE"
    serial-port-logging-enable = "TRUE"
    enable-oslogin             = "TRUE"
    user-data                  = <<-EOF
      #cloud-config
      users:
      - name: golink
        uid: 2000
        groups: docker
      write_files:
      - path: /run/fetch_secret
        permissions: 0755
        owner: root
        content: |
          #!/usr/bin/env bash
          set -euo pipefail
          TOKEN="$(curl -sfH 'Metadata-Flavor: Google' "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token" | jq -r .access_token)"
          curl -sf -H "Authorization: Bearer $TOKEN" "https://secretmanager.googleapis.com/v1/projects/cfoadvisors-production/secrets/$1/versions/$2:access" | jq -r .payload.data | base64 -d
      - path: /etc/systemd/system/golink.service
        permissions: 0644
        owner: root
        content: |
          [Unit]
          Description=Golink service
          Requires=docker.service
          After=docker.service
          [Service]
          Type=simple
          ExecStartPre=sudo -u golink /usr/bin/docker pull ${local.region}-docker.pkg.dev/${var.project}/ghcr-remote/tailscale/golink:latest
          ExecStart=bash -c 'docker run --rm --name golink --user 2000 --volume /var/lib/golink:/home/nonroot --env TS_AUTHKEY="$(/run/fetch_secret "${google_secret_manager_secret.secrets["ts-authkey"].secret_id}" latest)" ${local.region}-docker.pkg.dev/${var.project}/ghcr-remote/tailscale/golink:latest'
          ExecStop=/usr/bin/docker stop -t 10 golink
          Restart=always
          RestartSec=10
          StandardOutput=journal
          StandardError=journal
          [Install]
          WantedBy=multi-user.target
      runcmd:
      - sudo -u golink /usr/bin/docker-credential-gcr configure-docker --registries=${local.region}-docker.pkg.dev
      - mkdir -p /var/lib/golink
      - systemctl daemon-reload
      - systemctl start golink.service
    EOF
  }
}

# ---------------- Cloud SQL ----------------

locals {
  cloud_sql_sa_users = {
    god     = google_service_account.sa["god"]
    product = google_service_account.sa["product"]
  }
}

resource "google_sql_database_instance" "product" {
  name                = "product"
  region              = local.region
  database_version    = "POSTGRES_17"
  deletion_protection = var.environment == "production"
  settings {
    edition                     = "ENTERPRISE"
    tier                        = "db-f1-micro"
    deletion_protection_enabled = var.environment == "production"
    disk_type                   = "PD_SSD"
    disk_size                   = 10
    disk_autoresize_limit       = 100
    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = var.environment == "production"
    }
    database_flags {
      name  = "cloudsql.iam_authentication"
      value = "on"
    }
    ip_configuration {
      ipv4_enabled                                  = false
      private_network                               = google_compute_network.primary.self_link
      enable_private_path_for_google_cloud_services = true
    }
  }
  depends_on = [google_service_networking_connection.primary_psa]
}
resource "google_sql_database" "primary" {
  name            = "primary"
  instance        = google_sql_database_instance.product.name
  deletion_policy = "ABANDON"
}

resource "google_sql_user" "iam_users" {
  for_each = local.cloud_sql_sa_users
  name     = trimsuffix(each.value.email, ".gserviceaccount.com")
  type     = "CLOUD_IAM_SERVICE_ACCOUNT"
  instance = google_sql_database_instance.product.name
}
