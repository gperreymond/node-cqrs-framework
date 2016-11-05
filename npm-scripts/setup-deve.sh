#!/bin/sh

# -----------------------
# make sure all required dependencies are setup for developpement
# -----------------------

# exit on sub-module failure
set -e

docker-scripts/ci-bootstrap-container.sh "rabbitmq" "cqrs_rabbitmq" "-p 8089:15672 -p 5656:5672 -e RABBITMQ_DEFAULT_USER=user -e RABBITMQ_DEFAULT_PASS=password" "library/rabbitmq:3-management"
docker-scripts/wait-for-it.sh -h localhost -p 8089
