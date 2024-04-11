#!/usr/bin/env sh
set -eu

envsubst '${API_URL} ${APP_TITLE} ${APP_INFO} ${LANGUAGE} ${NAVIGATOR_LANGUAGE} ${BASENAME} ${EXTENSIONS} ${AUTHENTICATION} ${AUTH_SERVER_URL} ${AUTH_CLIENT_ID}' < /etc/nginx/config.js.template > /var/www/config.js

exec "$@"