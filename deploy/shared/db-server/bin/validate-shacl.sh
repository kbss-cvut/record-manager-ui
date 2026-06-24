#!/bin/bash

#
# Validates RDF data files against a SHACL shapes graph using pyshacl.
#
# Runs `pyshacl` directly, so it is meant to be executed INSIDE the db-server
# (GraphDB) container, where pyshacl is installed by the Dockerfile. This lets
# import data be checked with the same toolchain that deploys it, before any
# data reaches GraphDB.
#
# This script is generic (not tied to forms). repo-init.sh calls it for every
# `shapes/` folder it finds under the import tree; it can also be run by hand:
#
#   docker compose exec db-server \
#     /opt/graphdb/dist/bin/validate-shacl.sh \
#       -s /root/graphdb-import/record-manager-formgen/forms/shapes/form-template.shapes.ttl \
#       /root/graphdb-import/record-manager-formgen/forms/example-1-form.ttl
#
# Exit code: 0 if every data file conforms, 1 if any has violations or errors,
#            2 on usage / missing-file errors.
#

set -u

INFERENCE="none"
ONT_GRAPH=""
SHAPES=""
QUIET=false

print_usage() {
  cat <<EOF
SHACL validator (runs inside the db-server container).

Usage:
  $0 -s <SHAPES.ttl> [-e <ONTOLOGY.ttl>] [-i <none|rdfs|owlrl|both>] [-q] DATA_FILES...

Options:
  -s SHAPES     SHACL shapes graph to validate against (required).
  -e ONTOLOGY   Extra ontology / data graph passed to pyshacl (--ont-graph),
                useful when shapes rely on owl:imports or class hierarchies.
  -i INFERENCE  Inferencing before validation: none (default), rdfs, owlrl, both.
  -q            Quiet: print only the PASS/FAIL line per file (no violation report).
  -h            Show this help.

DATA_FILES are the RDF files to validate (one or more). The data format is
auto-detected from each file's extension by pyshacl.

Examples:
  $0 -s shapes/form-template.shapes.ttl forms/example-1-form.ttl forms/vita-form.ttl
EOF
}

while getopts "s:e:i:qh" arg; do
  case $arg in
    s) SHAPES=$OPTARG ;;
    e) ONT_GRAPH=$OPTARG ;;
    i) INFERENCE=$OPTARG ;;
    q) QUIET=true ;;
    h) print_usage; exit 0 ;;
    *) print_usage; exit 2 ;;
  esac
done
shift $((OPTIND - 1))

if ! command -v pyshacl >/dev/null 2>&1; then
  echo "ERROR: pyshacl not found on PATH. Run this inside the db-server container," >&2
  echo "       e.g.  docker compose exec db-server $0 ..." >&2
  exit 2
fi

if [ -z "$SHAPES" ]; then
  echo "ERROR: a SHACL shapes file is required (-s)." >&2
  print_usage >&2
  exit 2
fi
if [ ! -f "$SHAPES" ]; then
  echo "ERROR: shapes file not found: $SHAPES" >&2
  exit 2
fi
if [ -n "$ONT_GRAPH" ] && [ ! -f "$ONT_GRAPH" ]; then
  echo "ERROR: ontology file not found: $ONT_GRAPH" >&2
  exit 2
fi
if [ "$#" -eq 0 ]; then
  echo "ERROR: no data files given." >&2
  print_usage >&2
  exit 2
fi

ONT_ARGS=()
[ -n "$ONT_GRAPH" ] && ONT_ARGS=(-e "$ONT_GRAPH")

echo "INFO: *** SHACL VALIDATION ***"
echo "INFO:     - shapes:    $SHAPES"
[ -n "$ONT_GRAPH" ] && echo "INFO:     - ontology:  $ONT_GRAPH"
echo "INFO:     - inference: $INFERENCE"
echo "INFO:     - files:     $#"
echo

FAILED=0
TOTAL=0
for DATA in "$@"; do
  TOTAL=$((TOTAL + 1))
  if [ ! -f "$DATA" ]; then
    echo "FAIL  $DATA  (file not found)"
    FAILED=$((FAILED + 1))
    continue
  fi

  OUTPUT="$(pyshacl \
    -s "$SHAPES" \
    "${ONT_ARGS[@]}" \
    -i "$INFERENCE" \
    -f human \
    "$DATA" 2>&1)"
  STATUS=$?

  if [ "$STATUS" -eq 0 ]; then
    echo "PASS  $DATA"
  else
    echo "FAIL  $DATA"
    [ "$QUIET" = false ] && echo "$OUTPUT" | sed 's/^/          /'
    FAILED=$((FAILED + 1))
  fi
done

echo
if [ "$FAILED" -eq 0 ]; then
  echo "INFO: all $TOTAL file(s) conform."
  exit 0
else
  echo "ERROR: $FAILED of $TOTAL file(s) failed validation."
  exit 1
fi
