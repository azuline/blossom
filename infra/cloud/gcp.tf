terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.45.0"
    }
  }
}

# VARIABLES

variable "project" {
  type = string
}
variable "environment" {
  type = string
  validation {
    condition     = contains(["production", "sandbox"], var.environment)
    error_message = "environment must be one of ('production', 'sandbox')"
  }
}
variable "terraform_sa" {
  type = string
}
variable "engineers_group" {
  type = string
}

# CLOUD

provider "google" {
  project                     = var.project
  region                      = "us-west1"
  zone                        = "us-west1-a"
  impersonate_service_account = var.terraform_sa
}

# GOOGLE APIs

resource "google_project_service" "cloudresourcemanager" {
  project            = var.project
  service            = "cloudresourcemanager.googleapis.com"
  disable_on_destroy = false
}
resource "google_project_service" "serviceusage" {
  service            = "serviceusage.googleapis.com"
  disable_on_destroy = false
  depends_on         = [google_project_service.cloudresourcemanager]
}
resource "google_project_service" "iam" {
  service            = "iam.googleapis.com"
  disable_on_destroy = false
  depends_on         = [google_project_service.cloudresourcemanager]
}
resource "google_project_service" "compute" {
  service            = "compute.googleapis.com"
  disable_on_destroy = false
  depends_on         = [google_project_service.cloudresourcemanager]
}
resource "google_project_service" "sqladmin" {
  service            = "sqladmin.googleapis.com"
  disable_on_destroy = false
  depends_on         = [google_project_service.cloudresourcemanager]
}
resource "google_project_service" "servicenetworking" {
  service            = "servicenetworking.googleapis.com"
  disable_on_destroy = false
  depends_on         = [google_project_service.cloudresourcemanager]
}
resource "google_project_service" "cloudidentity" {
  service            = "cloudidentity.googleapis.com"
  disable_on_destroy = false
  depends_on         = [google_project_service.cloudresourcemanager]
}
resource "google_project_service" "secretmanager" {
  service            = "secretmanager.googleapis.com"
  disable_on_destroy = false
  depends_on         = [google_project_service.cloudresourcemanager]
}

# NETWORKS

resource "google_compute_network" "primary" {
  name       = "development-net"
  depends_on = [google_project_service.compute]
}

# Set up the PSA.
resource "google_compute_global_address" "psa_range" {
  name          = "development-psa-range"
  address_type  = "INTERNAL"
  purpose       = "VPC_PEERING"
  prefix_length = 16
  network       = google_compute_network.primary.id
  depends_on    = [google_project_service.compute]
}
resource "google_service_networking_connection" "psa_connection" {
  network                 = google_compute_network.primary.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.psa_range.name]
  depends_on              = [google_project_service.servicenetworking]
}

# SERVICE ACCOUNTS

resource "google_service_account" "god" {
  account_id   = "sa-god"
  display_name = "Emergency break-glass god mode"
}
resource "google_service_account" "product" {
  account_id   = "sa-product"
  display_name = "Product service IAM login"
}
resource "google_service_account" "tailscale_subnet_router" {
  account_id   = "sa-tailscale-subnet-router"
  display_name = "Tailscale subnet router IAM login"
}

# Grant Engineers the ability to impersonate each service account.
resource "google_service_account_iam_member" "god_engineers" {
  service_account_id = google_service_account.god.name
  role               = "roles/iam.serviceAccountTokenCreator"
  member             = "group:${var.engineers_group}"
}
resource "google_service_account_iam_member" "product_engineers" {
  service_account_id = google_service_account.product.name
  role               = "roles/iam.serviceAccountTokenCreator"
  member             = "group:${var.engineers_group}"
}
resource "google_service_account_iam_member" "tailscale_subnet_router_engineers" {
  service_account_id = google_service_account.tailscale_subnet_router.name
  role               = "roles/iam.serviceAccountTokenCreator"
  member             = "group:${var.engineers_group}"
}

# SECRETS

resource "google_secret_manager_secret" "ts_authkey" {
  secret_id = "ts-authkey"
  replication {
    auto {}
  }
}
resource "google_secret_manager_secret_iam_member" "ts_authkey_for_talscale_subnet_router" {
  secret_id = google_secret_manager_secret.ts_authkey.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.tailscale_subnet_router.email}"
}

# VPN

resource "google_compute_instance" "tailscale_subnet_router" {
  name           = "tailscale-subnet-router"
  machine_type   = "e2-micro"
  can_ip_forward = true
  boot_disk {
    initialize_params {
      image = "cos-cloud/cos-stable"
    }
  }
  network_interface {
    network = google_compute_network.primary.id
  }
  service_account {
    email = google_service_account.tailscale_subnet_router.email
    scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring.write",
    ]
  }
  metadata = {
    "secret-ts-authkey"         = "projects/${var.project}/secrets/${google_secret_manager_secret.ts_authkey.secret_id}"
    "gce-container-declaration" = <<-EOF
      spec:
        containers:
          - name: tailscale
            image: ghcr.io/tailscale/tailscale:v1.84.3
            env:
              - name: TS_ROUTES
                value: "${google_compute_global_address.psa_range.address}/${google_compute_global_address.psa_range.prefix_length}"
              - name: TS_STATE_DIR
                value: "/var/lib/tailscale"
              - name: TS_AUTH_ONCE
                value: true
              - name: TS_HOSTNAME
                value: gcp
              - name: TS_AUTHKEY
                valueFrom:
                  secretKeyRef:
                    name: "ts-authkey"
                    key: "latest"
            volumeMounts:
              - name: ts-state
                mountPath: /var/lib/tailscale
            securityContext:
              privileged: true
        volumes:
          - name: ts-state
            hostPath:
              path: /var/lib/tailscale
        restartPolicy: Always
    EOF
  }
  depends_on = [google_project_service.compute, google_secret_manager_secret_iam_member.ts_authkey_for_talscale_subnet_router]
}

# DATABASES

resource "google_sql_database_instance" "product" {
  name             = "product"
  region           = "us-west1"
  database_version = "POSTGRES_17"
  settings {
    # TODO: when paying up, go to enterprise plus
    edition                     = "ENTERPRISE"
    tier                        = "db-f1-micro"
    deletion_protection_enabled = var.environment == "production"
    disk_autoresize_limit       = 100
    disk_size                   = 10
    disk_type                   = "PD_SSD"
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
      private_network                               = "projects/${var.project}/global/networks/${google_compute_network.primary.name}"
      enable_private_path_for_google_cloud_services = true
    }
  }
  deletion_protection = var.environment == "production"
  depends_on          = [google_service_networking_connection.psa_connection, google_project_service.sqladmin]
}
resource "google_sql_database" "primary" {
  name            = "main-database"
  instance        = google_sql_database_instance.product.name
  deletion_policy = "ABANDON"
}
resource "google_sql_user" "product_god" {
  name     = trimsuffix(google_service_account.god.email, ".gserviceaccount.com")
  type     = "CLOUD_IAM_SERVICE_ACCOUNT"
  instance = google_sql_database_instance.product.name
}
resource "google_sql_user" "product_product" {
  name     = trimsuffix(google_service_account.product.email, ".gserviceaccount.com")
  type     = "CLOUD_IAM_SERVICE_ACCOUNT"
  instance = google_sql_database_instance.product.name
}

# OUTPUTS

output "service_account_god_email" {
  value = google_service_account.god.email
}
output "service_account_product_email" {
  value = google_service_account.product.email
}
output "psa_cidr_range" {
  value = "${google_compute_global_address.psa_range.address}/${google_compute_global_address.psa_range.prefix_length}"
}
