terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.45.0"
    }
  }
}

variable "project" {}

provider "google" {
  project = var.project
  region  = "us-west1"
  zone    = "us-west1-a"
}

resource "google_compute_network" "vpc_network" {
  name = "production-net"
}

resource "google_compute_instance" "vm_instance" {
  name         = "demo-instance"
  machine_type = "e2-micro"
  tags         = ["daemon"]
  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }
  network_interface {
    network = google_compute_network.vpc_network.name
    access_config {}
  }
}
