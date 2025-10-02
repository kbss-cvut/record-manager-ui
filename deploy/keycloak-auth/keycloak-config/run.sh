#!/bin/sh

AUTH_SERVER_HOSTNAME="$1"
AUTH_SERVER_PORT="$2"

until nc -z $AUTH_SERVER_HOSTNAME $AUTH_SERVER_PORT; do
  echo INFO: Waiting for keycloak authorizaion server running at $AUTH_SERVER_HOSTNAME:$AUTH_SERVER_PORT ...
  sleep 1; 
done 
terraform init
terraform apply -auto-approve
