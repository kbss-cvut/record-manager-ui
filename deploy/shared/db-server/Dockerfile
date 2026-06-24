FROM ontotext/graphdb:10.6.3

# Override parent entrypoint
ENTRYPOINT []

ENV GRAPHDB_HOME=/opt/graphdb/home
ENV GRAPHDB_INSTALL_DIR=/opt/graphdb/dist

WORKDIR ${GRAPHDB_HOME}

# Install libs related to RDF processing. Both deps come from pip (not the OS
# package manager), so pip owns them cleanly and --break-system-packages only
# bypasses PEP 668 without clobbering any OS package:
#   - rdflib  — used directly by the import helper scripts (get-rdf-*.py),
#               listed explicitly so it doesn't rely on pyshacl pulling it in;
#   - pyshacl — SHACL validation.
### for arm64
RUN if command -v apt >/dev/null; then \
    apt update && \
    apt install -y python3-pip && \
    apt install -y liburi-perl && \
    pip install --no-cache-dir --break-system-packages \
        rdflib \
        pyshacl; \
fi

### for amd64
RUN if command -v apk >/dev/null; then \
    apk add py3-pip && \
    apk add perl-uri && \
    pip install --no-cache-dir --break-system-packages \
        rdflib \
        pyshacl; \
fi




# Copy initialization repository config
COPY init-config /repo-config
COPY bin/* ${GRAPHDB_INSTALL_DIR}/bin/

EXPOSE 7200

CMD ${GRAPHDB_INSTALL_DIR}/bin/repo-init.sh /repo-config ${GRAPHDB_HOME} & ${GRAPHDB_INSTALL_DIR}/bin/graphdb -Dgraphdb.home=${GRAPHDB_HOME} -Dgraphdb.logback=${GRAPHDB_INSTALL_DIR}/conf/logback.xml
