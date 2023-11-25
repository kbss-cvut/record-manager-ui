#!/bin/bash

#
# Initializes Record Manager GraphDB repositories if they do not already exist
#

SOURCE_DIR=$1
GRAPHDB_HOME=$2
REPOSITORIES=("record-manager-app" "record-manager-formgen")
SHOULD_WAIT=true

echo "Running repository initializer..."

for REPO_NAME in ${REPOSITORIES[@]}
do
  echo "Checking existence of repository '${REPO_NAME}'"
  if [ ! -d ${GRAPHDB_HOME}/data/repositories/${REPO_NAME} ] || [ -z "$(ls -A ${GRAPHDB_HOME})/data/repositories/${REPO_NAME}" ];
  then
    if [ "${SHOULD_WAIT}" = "true" ];
    then
      # Wait for GraphDB to start up
      echo "Waiting for GraphDB to start up..."
      sleep 15s
      SHOULD_WAIT=false
    fi

        # Create repository based on configuration
    echo "Creating repository '${REPO_NAME}'..."
    curl -X POST --header "Content-Type: multipart/form-data" -F "config=@${SOURCE_DIR}/config-${REPO_NAME}.ttl" "http://localhost:7200/rest/repositories"
    echo "Repository '${REPO_NAME}' successfully initialized."
  else
    echo "Repository '${REPO_NAME}' already exists. Skipping initialization..."
  fi
done
