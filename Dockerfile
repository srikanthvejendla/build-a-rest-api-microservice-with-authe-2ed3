# ---- Build Stage ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --production=false
COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma
COPY jest.config.js ./
COPY .env.example ./
# Generate Prisma client
RUN npx prisma generate
# Run tests (fail build if tests fail)
RUN npm test
# Build TypeScript
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/.env.example ./
COPY --from=build /app/keys ./keys
# Copy entrypoint
CMD ["node", "dist/index.js"]
