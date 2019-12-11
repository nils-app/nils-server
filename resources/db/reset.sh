#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
DB_DIR="/usr/local/var/postgres"
DB_NAME="nils"

${DIR}/stop.sh

rm -rf $DB_DIR
mkdir -p $DB_DIR

initdb $DB_DIR

${DIR}/start.sh

createdb $DB_NAME

psql -d $DB_NAME -c 'CREATE EXTENSION pgcrypto;'
psql -d $DB_NAME -a -f "${DIR}/schema.sql"
