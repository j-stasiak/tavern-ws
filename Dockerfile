FROM node:lts AS installer
WORKDIR /app
COPY package*.json .
RUN npm ci

FROM node:lts-alpine AS publish
WORKDIR /app
EXPOSE 80
RUN chown -R node:node /app
USER node
COPY --from=installer /app/node_modules node_modules
COPY .  .
ENTRYPOINT ["node", "src/index.js"]