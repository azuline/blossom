FROM mcr.microsoft.com/playwright:v1.45.1-focal 
WORKDIR /usr/app/stories
# We install pnpm to use it with the host packages. Make sure to pnpm install
# in the host!
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
ENTRYPOINT ["pnpm", "playwright", "test", "visualtest"]
