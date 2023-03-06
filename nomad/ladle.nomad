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
          "local/nginx.conf:/etc/nginx/conf.d/default.conf",
        ]
      }
      artifact {
        source      = "[[.artifact_source_url]]"
        destination = "local/ladle"
      }
      template {
        data          = <<EOF
server {
	listen 80;
	listen [::]:80;
	root /www;
	index index.html;
}
EOF
        destination   = "local/nginx.conf"
        change_mode   = "signal"
        change_signal = "SIGHUP"
      }
    }
  }
}
