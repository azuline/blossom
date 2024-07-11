check: typecheck test lintcheck

start:
	QUART_DEBUG=1 QUART_APP="foundation.webserver:debug_app()" quart run --port 40851

test:
	pytest --cov=. --cov-branch .
	coverage html

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
	ruff format --check .
	ruff check .
	semgrep --config .semgrep/ .

lint:
	ruff format .
	ruff check --fix .
	semgrep --config .semgrep/ --autofix .

new-migration:
	yoyo new --sql

.PHONY: check start test testseq codegen migrate psql typecheck lintcheck lint new-migration
