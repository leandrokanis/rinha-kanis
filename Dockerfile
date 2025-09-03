FROM oven/bun:1.1.29-alpine
WORKDIR /app
COPY package.json bun.lockb* tsconfig.json ./
RUN bun install --frozen-lockfile
COPY src ./src
ENV PORT=3000
CMD ["bun","src/server.ts"]
