#!/bin/sh

until curl --output /dev/null --silent --fail http://localhost:9200/_cluster/health; do
  printf '.'
  sleep 5
done
