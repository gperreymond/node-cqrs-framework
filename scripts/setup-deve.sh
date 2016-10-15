#!/bin/sh

# script/start-deve- make sure all required dependencies are setup for developpement

# exit on sub-module failure
set -e

./scripts/ci-bootstrap-rethinkdb.sh
./scripts/ci-bootstrap-rabbitmq.sh
