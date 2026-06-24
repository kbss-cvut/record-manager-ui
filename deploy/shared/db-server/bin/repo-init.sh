#!/bin/sh

#
# Initializes GraphDB repositories (the repositories are created if they do not exist yet and some of the data are replaced)
#

SOURCE_DIR=$1
GRAPHDB_HOME=$2

SCRIPT_DIR="`dirname $0`"

wait_for_graphdb() {
    # Set the GraphDB URL and max retry attempts
    local GRAPHDB_URL="http://localhost:7200/rest/repositories"
    local MAX_RETRIES=30
    local RETRY_INTERVAL=1 # seconds

    # Loop to check if GraphDB is ready
    local attempt=1
    while ! curl -s --head --fail "$GRAPHDB_URL" > /dev/null; do
        if [ $attempt -ge $MAX_RETRIES ]; then
            echo "ERROR: GraphDB did not start within the expected time."
            return 1
        fi
        echo "INFO: Waiting for GraphDB to be ready (Attempt $attempt/$MAX_RETRIES)..."
        sleep $RETRY_INTERVAL
        attempt=$((attempt + 1))
    done

    echo "INFO: GraphDB is up and running."
    return 0
}

#
# Generic SHACL validation of import data.
#
# Convention: any data folder (let's call it PARENT) may contain a `shapes/` subfolder. When it does:
#   - every file in that `shapes/` subfolder must be named *.shapes.ttl
#   - VALIDATION_CANDIDATES are all *.ttl files recursively in PARENT ignoring any `shapes` subfolders
#   - VALIDATION_CANDIDATES are validated against all shapes files from PARENT/`shapes` subfolder
#
# Validation is advisory only: failures are logged as warnings and deployment
# proceeds regardless.
#
validate_shapes_folder() {
    local SHAPES_DIR="$1"
    local PARENT_DIR="`dirname "$SHAPES_DIR"`"

    # Enforce the naming convention for files living in a shapes folder.
    find "$SHAPES_DIR" -maxdepth 1 -type f ! -name '*.shapes.ttl' | while read NON_SHAPE; do
        echo "WARNING: file in shapes folder is not named *.shapes.ttl and is ignored: $NON_SHAPE"
    done

    local SHAPE_FILES="`find "$SHAPES_DIR" -maxdepth 1 -type f -name '*.shapes.ttl' | sort`"
    if [ -z "$SHAPE_FILES" ]; then
        echo "INFO: shapes folder $SHAPES_DIR has no *.shapes.ttl files; nothing to validate."
        return 0
    fi

    # Validation candidates: all *.ttl files recursively under the parent folder,
    # ignoring any `shapes` subfolders (where the shape files themselves live).
    local TARGET_FILES="`find "$PARENT_DIR" -type f -name '*.ttl' -not -path '*/shapes/*' | sort`"
    if [ -z "$TARGET_FILES" ]; then
        echo "INFO: no .ttl files to validate in $PARENT_DIR."
        return 0
    fi

    echo "$SHAPE_FILES" | while read SHAPE_FILE; do
        echo "INFO: Validating data files in $PARENT_DIR against shapes $SHAPE_FILE ..."
        if ! $SCRIPT_DIR/validate-shacl.sh -s "$SHAPE_FILE" $TARGET_FILES; then
            echo "WARNING: SHACL validation reported failures for shapes $SHAPE_FILE (see report above). Continuing with deployment."
        fi
    done
}

############
### MAIN ###
############

echo "INFO: Running initializer for GraphDB repositories ..."

echo "INFO: Waiting for GraphDB to start up..."
if ! wait_for_graphdb; then
    echo "ERROR: Could not establish connection to GraphDB. Exiting."
    exit 1
fi

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
cd /

echo "INFO: *** Validating import data against SHACL shapes folders ***"
find "$DATA_DIR" -type d -name shapes | sort | while read SHAPES_DIR; do
    validate_shapes_folder "$SHAPES_DIR"
done

for DIR in ${DATA_DIR}/*/; do
    REPO_NAME="`basename ${DIR}`"

    echo "INFO: Updating data in repository $REPO_NAME ..."

    find ${DATA_DIR}/${REPO_NAME} -name '*-form.ttl' | while read DATA_FILE; do
echo "INFO: Inferring context from ${DATA_FILE}."
	CONTEXT=`$SCRIPT_DIR/get-rdf-subject-iri-by-type.py $DATA_FILE 'http://onto.fel.cvut.cz/ontologies/form/form-template'` || continue

	echo "INFO: Replacing context ${CONTEXT} with form template from file ${DATA_FILE}."
	$SCRIPT_DIR/rdf4j-deploy-context.sh -R -C 'text/turtle' -s http://localhost:7200 -r ${REPO_NAME} -c ${CONTEXT} ${DATA_FILE}
    done

    find ${DATA_DIR}/${REPO_NAME} -name '*.trig' | while read DATA_FILE; do

	echo "INFO: Replacing contexts with data from file ${DATA_FILE}."
	$SCRIPT_DIR/rdf4j-deploy-context.sh -R -C 'application/trig' -s http://localhost:7200 -r ${REPO_NAME} ${DATA_FILE}
    done

    find ${DATA_DIR}/${REPO_NAME} -name '*.ru' | while read UPDATE_QUERY_FILE; do

	echo "INFO: Running update query from file ${UPDATE_QUERY_FILE}."
        $SCRIPT_DIR/rdf4j-sparql-update.sh -s http://localhost:7200 -r ${REPO_NAME} -q ${UPDATE_QUERY_FILE}
    done
done
