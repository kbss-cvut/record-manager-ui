#!/bin/bash
set -e

/opt/keycloak/bin/kc.sh "$@" &
KEYCLOAK_PID=$!

sleep 40

/roles-configuration.sh

wait $KEYCLOAK_PID

