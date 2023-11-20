#!/bin/sh

#
# Initializes Record Manager GraphDB repositories if it does not already exist
#

SOURCE_DIR=$1
GRAPHDB_HOME=$2

SCRIPT_DIR="`dirname $0`"

echo "INFO: Running initializer for Record Manager repositories ..."

# Wait for GraphDB to start up
echo "INFO: Waiting for GraphDB to start up..."
sleep 15s

ls ${SOURCE_DIR}/*-config.ttl | while read REPO_CONFIG_FILE; do 
	
	REPO_NAME=`$SCRIPT_DIR/get-value-of-rdf-property.py $REPO_CONFIG_FILE 'http://www.openrdf.org/config/repository#repositoryID'`

	if [ -z "$REPO_NAME" ]; then
    		echo "ERROR: Could not parse repository name from file $REPO_CONFIG_FILE" 
    		exit 1
	fi

	if [ ! -d ${GRAPHDB_HOME}/data/repositories/${REPO_NAME} ] || [ -z "$(ls -A ${GRAPHDB_HOME})/data/repositories/${REPO_NAME}" ]; then
		echo "INFO: Initializing repository $REPO_NAME..."

	    # Create repository based on configuration
	    echo "INFO: Creating repository $REPO_NAME..."
	    curl -X POST --header "Content-Type: multipart/form-data" -F "config=@${REPO_CONFIG_FILE}" "http://localhost:7200/rest/repositories"
	    echo "INFO: Repository $REPO_NAME successfully initialized."
	else
	    echo "INFO: Repository $REPO_NAME already exists. Skipping initialization..."
	fi
done


DATA_DIR=/root/graphdb-import

ls ${DATA_DIR}/forms/*.ttl | while read DATA_FILE; do
	REPO_NAME="record-manager-formgen"
	CONTEXT=`$SCRIPT_DIR/get-rdf-subject-by-type.py $DATA_FILE 'http://onto.fel.cvut.cz/ontologies/form/form-template' | sed 's/[<>]//g'`

	echo "INFO: Deploying form templates ${DATA_FILE} into ${CONTEXT}."
	$SCRIPT_DIR/rdf4j-deploy-context.sh -R -C 'text/turtle' -s http://localhost:7200 -r ${REPO_NAME} -c ${CONTEXT} ${DATA_FILE}
done
