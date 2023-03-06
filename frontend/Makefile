check: typecheck test lintcheck

clean:
	rm -rf build dist coverage

install:
	pnpm install

start:
	pnpm vite --port 40853 --strictPort

build:
	pnpm vite build

build-analyze:
	ANALYZE=1 pnpm vite build

preview:
	pnpm vite preview

stories:
	pnpm ladle serve --port 40854

build-stories:
	pnpm ladle build

test:
	pnpm vitest run --coverage

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

typecheck:
	pnpm tsc

lint:
	pnpm eslint --ext .ts,.tsx --cache --max-warnings=0 --fix .
	dprint fmt
	pnpm unimported

lintcheck:
	pnpm eslint --ext .ts,.tsx --cache --max-warnings=0 .
	dprint check
	pnpm unimported

.PHONY: check install start build build-analyze preview test test-visual update-visual typecheck lint lintcheck

# Below here are not commands.

visual-container: playwright.Dockerfile
	docker build --tag playwright-test:latest - < playwright.Dockerfile
