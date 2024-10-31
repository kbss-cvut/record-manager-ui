#!/usr/bin/env sh
set -eu

envsubst '${API_URL} ${APP_TITLE} ${APP_INFO} ${APP_LANGUAGE} ${NAVIGATOR_LANGUAGE} ${BASENAME} ${EXTENSIONS} ${AUTHENTICATION} ${AUTH_SERVER_URL} ${AUTH_CLIENT_ID} ${ANALYTICS_URL}' < /etc/nginx/config.js.template > /var/www/config.js

exec "$@"