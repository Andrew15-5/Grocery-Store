FROM node:18.7-alpine3.16@sha256:02a5466bd5abde6cde29c16d83e2f5a10eec11c8dcefa667a2c9f88a7fa8b0b3 as transpiledTS
COPY package.json package-lock.json ./
RUN npm ci
COPY src/ tsconfig.json ./
RUN npx tsc

FROM node:18.7-alpine3.16@sha256:02a5466bd5abde6cde29c16d83e2f5a10eec11c8dcefa667a2c9f88a7fa8b0b3 as production
ENV NODE_ENV production
RUN apk add --no-cache jq
COPY package.json package-lock.json ./
RUN npm ci
RUN mv package.json pckg.jsn && jq '{main:.main}' pckg.jsn > package.json

FROM node:18.7-alpine3.16@sha256:02a5466bd5abde6cde29c16d83e2f5a10eec11c8dcefa667a2c9f88a7fa8b0b3
ENV NODE_ENV production
USER node
WORKDIR /usr/src/app/
ENTRYPOINT ["node", "."]
ARG SERVER_PORT
EXPOSE ${SERVER_PORT}
COPY --chown=node:node --from=production node_modules/ ./node_modules/
COPY --chown=node:node --from=production package.json .
COPY --chown=node:node .env .
COPY --chown=node:node views views
COPY --chown=node:node public public
COPY --chown=node:node --from=transpiledTS dist/ ./dist/
