check: typecheck test lintcheck

start:
	QUART_DEBUG=1 QUART_APP="foundation.webserver:debug_app()" quart run --port 40851

test:
	pytest --cov=. --cov-branch .
	coverage html

migrate:
	blossom migrate
	pgmigrate dump -o schema.sql

codegen:
	blossom codegen

psql:
	psql postgres://postgres:password@localhost:40852

typecheck:
	pyright

lintcheck:
	ruff check .
	ruff format --check .
	semgrep --config .semgrep/ .

lint:
	ruff check --fix .
	ruff format .
	semgrep --config .semgrep/ --autofix .

.PHONY: check start test testseq codegen migrate psql typecheck lintcheck lint
