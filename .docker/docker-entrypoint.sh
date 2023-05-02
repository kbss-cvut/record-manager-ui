#!/usr/bin/env sh
set -eu

envsubst '${API_URL} ${APP_TITLE} ${LANGUAGE} ${NAVIGATOR_LANGUAGE} ${BASENAME} ${EXTENSIONS}' < /etc/nginx/config.js.template > /var/www/config.js

cp /etc/nginx/index.html.template /var/www/index.html
sed  -i "s|%RECORD_MANAGER_BASENAME%|${BASENAME}|g" /var/www/index.html
sed  -i "s|%RECORD_MANAGER_APP_INFO%|${APP_INFO}|g" /var/www/index.html

exec "$@"