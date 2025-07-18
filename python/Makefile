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

lint:
	pyright
	ruff check --fix .
	ruff format .
	semgrep --config .semgrep/ --autofix .

diff:
	git status
	git diff
	bash -c '[[ -z $(git status -s) ]] || (exit 1)'

.PHONY: start test migrate codegen psql lint diff
