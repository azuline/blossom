job "blossom-ladle" {
  datacenters = ["zen"]
  namespace = "blossom"
  type = "service"

  group "blossom-ladle" {
    count = 1

    network {
      mode = "bridge"
    }

    service {
      name = "blossom-ladle"
      port = "80"
      connect {
        sidecar_service {}
      }
    }

    task "blossom-ladle" {
      driver = "docker"
      config {
        image   = "nginx"
        volumes = [
          "local/ladle:/www",
        ]
      }
      artifact {
        source      = "[[.artifact_source_url]]"
        destination = "local/ladle"
      }
    }
  }

  # Always deploy a new version.
  meta {
    run_uuid = "${uuidv4()}"
  }
}
