#!/usr/bin/env sh
set -eu

envsubst '${API_URL}' < /etc/nginx/config.js.template > /var/www/config.js

exec "$@"