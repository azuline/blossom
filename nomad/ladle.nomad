job "blossom-ladle" {
  datacenters = ["frieren"]
  namespace   = "blossom"
  type        = "service"

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
      check {
        expose   = true
        type     = "http"
        path     = "/health"
        interval = "10s"
        timeout  = "2s"
      }
    }

    task "blossom-ladle" {
      driver = "docker"
      config {
        image = "nginx"
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

  location /health {
    return 200 'ok';
  }
}
EOF
        destination   = "local/nginx.conf"
        change_mode   = "signal"
        change_signal = "SIGHUP"
      }
    }
  }

  update {
    max_parallel      = 1
    health_check      = "checks"
    min_healthy_time  = "10s"
    healthy_deadline  = "1m"
    progress_deadline = "10m"
    auto_revert       = true
    auto_promote      = true
    canary            = 1
  }
}
