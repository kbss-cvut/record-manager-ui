FROM ghcr.io/kbss-cvut/keycloak-graphdb-user-replicator/keycloak-graphdb:latest

COPY entrypoint.sh .
COPY roles-configuration.sh .

ENTRYPOINT ["/bin/bash", "entrypoint.sh"]