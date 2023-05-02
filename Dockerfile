# BASE STAGE
# Prepare node, copy package.json
FROM node:14 AS base
WORKDIR /usr/src/app
COPY package.json package-lock.json ./

# DEPENDENCIES STAGE
# Install production and dev dependencies
FROM base AS dependencies
# install node packages
RUN npm set progress=false && npm config set depth 0
RUN npm ci

# TEST STAGE
# run linters, setup and tests
FROM dependencies AS test
COPY . .
#RUN  npm run test-ci

# BUILD STAGE
# run NPM build
FROM test as build
RUN set -ex; FORCE_BASENAME=true RECORD_MANAGER_BASENAME="%RECORD_MANAGER_BASENAME%" RECORD_MANAGER_APP_INFO="%RECORD_MANAGER_APP_INFO%" npm run build

# RELEASE STAGE
# Only include the static files in the final image
FROM nginx:1.17.0-alpine

ENV BASENAME=""
ENV APP_INFO='<a href="https://github.com/blcham" target="_blank" rel="noopener noreferrer" title="github.com/blcham, 2023">©&nbsp;github.com/blcham, 2023</a>'

# Copy the react build from Build Stage
COPY --from=build /usr/src/app/build /var/www

# Copy error page
COPY .docker/error.html /usr/share/nginx/html

# Copy our custom nginx config
COPY .docker/nginx.conf /etc/nginx/nginx.conf

# Copy our custom javascript config template
COPY .docker/config.js.template /etc/nginx/config.js.template

# Copy our custom html template
COPY --from=build /usr/src/app/build/index.html /etc/nginx/index.html.template

# from the outside.
EXPOSE 80

COPY .docker/docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

