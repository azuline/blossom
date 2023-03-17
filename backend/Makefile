check: typecheck test lintcheck

start:
	QUART_DEBUG=1 QUART_APP="foundation.webserver:debug_app()" quart run --port 40851

test:
	pytest --cov=. --cov-branch .
	coverage html

snapshot:
	pytest --snapshot-update .

migrate:
	blossom migrate

codegen:
	sqlc-py generate
	blossom codegen

psql:
	psql postgres://postgres:password@localhost:40852

typecheck:
	mypy .

lintcheck:
	black --check .
	ruff .
	semgrep .

lint:
	black .
	ruff --fix .
	semgrep --autofix .

new-migration:
	yoyo new --sql

.PHONY: check start test testseq codegen migrate psql typecheck lintcheck lint new-migration
