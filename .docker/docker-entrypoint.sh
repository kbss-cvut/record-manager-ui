#!/usr/bin/env sh
set -eu

envsubst '${API_URL} ${APP_TITLE} ${LANGUAGE} ${NAVIGATOR_LANGUAGE} ${BASENAME} ${EXTENSIONS}' < /etc/nginx/config.js.template > /var/www/config.js

sed  "s|%RECORD_MANAGER_BASENAME%|${BASENAME}|g" < /etc/nginx/index.html.template > /var/www/index.html

exec "$@"