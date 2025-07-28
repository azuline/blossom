terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.45.0"
    }
  }
}

provider "google" {
  project = "steam-nuance-392001"
  region  = "us-west1"
  zone    = "us-west1-a"
}

resource "google_compute_network" "vpc_network" {
  name = "production-net"
}
