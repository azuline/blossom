# we run turbo commands with --no-daemon to avoid this bug: https://github.com/vercel/turbo/issues/4137.
check: typecheck test lintcheck

clean:
	pnpm turbo --no-daemon clean --concurrency `nproc`

install:
	pnpm install

test:
	pnpm turbo --no-daemon test --concurrency `nproc`

build:
	pnpm turbo --no-daemon build --concurrency `nproc`

build-analyze:
	ANALYZE=1 pnpm turbo --no-daemon build --concurrency `nproc`

typecheck:
	pnpm turbo --no-daemon typecheck --concurrency `nproc`

lint:
	pnpm turbo --no-daemon lint --concurrency `nproc`

lintcheck:
	pnpm turbo --no-daemon lintcheck --concurrency `nproc`

typewatch:
	pnpm turbo --no-daemon typewatch --concurrency 999

start:
	pnpm turbo --no-daemon start --concurrency 999

stories:
	pnpm ladle serve --port 40854

build-stories:
	pnpm ladle build

test-visual: visual-container
	pnpm start-server-and-test \
		'pnpm ladle build && pnpm ladle preview --host 172.17.0.1 --port 40855' \
		'http://172.17.0.1:40855' \
		'docker run --mount type=bind,source="$(realpath .)",target=/usr/app --network host --add-host host.docker.internal:host-gateway playwright-test:latest'

update-visual: visual-container
	pnpm start-server-and-test \
		'pnpm ladle build && pnpm ladle preview --host 172.17.0.1 --port 40855' \
		'http://172.17.0.1:40855' \
		'docker run --mount type=bind,source="$(realpath .)",target=/usr/app --network host --add-host host.docker.internal:host-gateway playwright-test:latest --update-snapshots'

.PHONY: check install start build build-analyze preview stories prop-types build-stories test test-visual update-visual typecheck lint lintcheck

# Below here are not commands.

visual-container: playwright.Dockerfile
	docker build --tag playwright-test:latest - < playwright.Dockerfile
