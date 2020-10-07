FROM node:12-alpine as build-server
RUN apk add --no-cache git bash gettext
ENV SKIP_PREFLIGHT_CHECK=true

WORKDIR /usr/src/server

# Install packages
COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn

COPY . .
RUN yarn build

ENTRYPOINT [ "yarn" ]

FROM node:12-alpine as stage-server
RUN apk add --no-cache git jq gettext
ENV NODE_ENV=production
WORKDIR /usr/src/server

COPY --from=build-server /usr/src/server .


# prune dev deps https://github.com/yarnpkg/yarn/issues/696
RUN yarn remove $(cat package.json | jq -r '.devDependencies | keys | join(" ")')

FROM node:12-alpine as server
ENV NODE_ENV=production
ENV PORT=3012

# Copy the React Front End build files
WORKDIR /usr/src
COPY --from=stage-server /usr/src/server .

# Start the server
EXPOSE 3012
CMD [ "node", "dist/main.js" ]