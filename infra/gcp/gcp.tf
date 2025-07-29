terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.45.0"
    }
  }
}

# VARIABLES

variable "project" {}
variable "environment" {}

# CLOUD

provider "google" {
  project = var.project
  region  = "us-west1"
  zone    = "us-west1-a"
}

# NETWORKS

resource "google_compute_network" "primary" {
  name = "${var.environment}-net"
}

# SERVICE ACCOUNTS

resource "google_service_account" "god" {
  account_id   = "sa-god"
  display_name = "Emergency Break-Glass God Mode"
}

# DATABASES

resource "google_sql_database_instance" "primary" {
  name             = "main-instance"
  region           = "us-west1"
  database_version = "POSTGRES_16"
  settings {
    # TODO(when paying up, go to enterprise plus)
    edition = "ENTERPRISE"
    tier                        = "db-f1-micro"
    deletion_protection_enabled = var.environment == "production"
    disk_autoresize_limit       = 100
    disk_size                   = 10
    disk_type                   = "PD_SSD"
    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = var.environment == "production"
    }
    ip_configuration {
      private_network = "projects/${var.project}/global/networks/${google_compute_network.primary.name}"
      enable_private_path_for_google_cloud_services = true
    }
  }
  deletion_protection = true
}

resource "google_sql_database" "primary" {
  name            = "main-database"
  instance        = google_sql_database_instance.primary.name
  deletion_policy = "ABANDON"
}
