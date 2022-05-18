#!/bin/sh

echo "==> Starting the backing services in Docker..."

docker-compose up --scale=app=0 -d

echo "==> Waiting for Opensearch to become available..."

script/utils/wait-for-opensearch.sh
