# Build do Frontend
FROM node:20.19.0-alpine AS build
WORKDIR /app
COPY package*.json .
COPY package-lock.json .
RUN npm ci --legacy-peer-deps --no-audit --no-fund
COPY . .
RUN npm run build -- --configuration production

# Runtime
FROM node:20.19.0-alpine
WORKDIR /app
RUN npm install -g http-server
COPY --from=build /app/dist/generic-interface/browser ./dist
EXPOSE 4200
CMD ["http-server", "./dist", "-p", "4200", "-a", "0.0.0.0", "--single"]