FROM mcr.microsoft.com/playwright:v1.31.2-focal 
WORKDIR /usr/app
# We install pnpm to use it with the host packages. Make sure to pnpm install
# in the host!
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
# Default to 4 workers.
ENV NUM_WORKERS 4
ENTRYPOINT ["pnpm", "playwright", "test", "visualtest"]
