# Build context is the repo root, not mcp/: the server imports ../src/data and
# ../src/types. No build step — Node 22.18+ strips types and runs src/ directly.
FROM node:22-alpine

WORKDIR /app
COPY mcp/package.json mcp/package-lock.json mcp/
RUN npm ci --prefix mcp --omit=dev

COPY src/data src/data
COPY src/types src/types
COPY mcp/src mcp/src

WORKDIR /app/mcp
ENV NODE_ENV=production
CMD ["node", "src/serve.ts"]
