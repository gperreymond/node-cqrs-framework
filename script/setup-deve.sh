#!/bin/sh

# script/start-deve- make sure all required dependencies are setup for developpement

# exit on sub-module failure
set -e

./script/ci-bootstrap-rethinkdb.sh
./script/ci-bootstrap-rabbitmq.sh
