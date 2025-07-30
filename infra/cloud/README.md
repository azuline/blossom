# GCP setup

Manual steps:

- Create an `engineers@<your-domain>.com` google group by hand: https://groups.google.com/u/0/all-groups.

```bash
$ PROJECT="..."
$ YOUR_EMAIL="..."
$ gcloud auth application-default login
$ gcloud config set-project "$PROJECT"
$ gcloud iam service-accounts create terraform
$ gcloud iam service-accounts add-iam-policy-binding \
    terraform@$PROJECT.iam.gserviceaccount.com \
    --member="user:$YOUR_EMAIL" \
    --role="roles/iam.serviceAccountTokenCreator" \
    --project=$PROJECT
```

## Terraform setup

```bash
$ cp terraform.tfvars{.example,}
$ vim terraform.tfvars
$ terraform apply
```

TODO: adding secrets via cli

## Tailscale

- make authkey, add secret via cli
- in admin panel, approve routes and disable node expiry

## Containers

$ gcloud compute ssh tailscale-subnet-router

## Database

$ cloud-sql-proxy --private-ip cfoadvisors-production:us-west1:product --impersonate-service-account=sa-god@cfoadvisors-production.iam.gserviceaccount.com --run-connection-test 
$ psql "postgresql://sa-god%40cfoadvisors-production.iam:$DB_PASSWORD@localhost:5432/postgres?sslmode=disable"
