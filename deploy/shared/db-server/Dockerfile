FROM ontotext/graphdb:10.2.0

# Override parent entrypoint
ENTRYPOINT []

ENV GRAPHDB_HOME=/opt/graphdb/home
ENV GRAPHDB_INSTALL_DIR=/opt/graphdb/dist

WORKDIR ${GRAPHDB_HOME}

# Copy repository config
COPY repo-config /repo-config
COPY repo-init.sh ${GRAPHDB_INSTALL_DIR}/repo-init.sh

EXPOSE 7200

CMD ${GRAPHDB_INSTALL_DIR}/repo-init.sh /repo-config ${GRAPHDB_HOME} & ${GRAPHDB_INSTALL_DIR}/bin/graphdb -Dgraphdb.home=${GRAPHDB_HOME}

