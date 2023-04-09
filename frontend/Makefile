# we run turbo commands with --no-daemon to avoid this bug: https://github.com/vercel/turbo/issues/4137.
check: typecheck test lintcheck

clean:
	pnpm turbo --no-daemon clean --concurrency `nproc`

install:
	pnpm install

typewatch:
	pnpm turbo --no-daemon typewatch --concurrency 999

start:
	pnpm turbo --no-daemon start --concurrency 999

# Set ANALYZE=1 to analyze build output.
build:
	pnpm turbo --no-daemon build --concurrency `nproc`

build-app:
	pnpm turbo --no-daemon build --concurrency `nproc` --filter="@product/app"

build-stories:
	pnpm turbo --no-daemon build --concurrency `nproc` --filter="@stories"

preview:
	pnpm turbo --no-daemon preview --concurrency 999

preview-app:
	pnpm turbo --no-daemon preview --concurrency 999 --filter="@product/app"

preview-stories:
	pnpm turbo --no-daemon preview --concurrency 999 --filter="@stories"

test:
	pnpm turbo --no-daemon test --concurrency `nproc`

typecheck:
	pnpm turbo --no-daemon typecheck --concurrency `nproc`

lint:
	pnpm turbo --no-daemon lint --concurrency `nproc`

lintcheck:
	pnpm turbo --no-daemon lintcheck --concurrency `nproc`

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

.PHONY: check install typewatch start test build build-app build-stories preview preview-app preview-stories typecheck lint lintcheck test-visual update-visual

# Below here are not commands.

visual-container: playwright.Dockerfile
	docker build --tag playwright-test:latest - < playwright.Dockerfile
