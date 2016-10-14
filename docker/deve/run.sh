#!/bin/sh
set -e

# start dockers
docker-compose --file docker/deve/docker-compose.yml up -d

# get network rethinkdb
CQRS_RETHINKDB_HOST={\"CQRS_RETHINKDB_HOST\":\"$(docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' rethinkdb.cqrs.deve)\"}
echo $CQRS_RETHINKDB_HOST > example/rethinkdb.cqrs.json

# get network rabbitmq
CQRS_RABBITMQ_URL={\"CQRS_RABBITMQ_URL\":\"amqp://$(docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' rabbitmq.cqrs.deve)\"}
echo $CQRS_RABBITMQ_URL > example/rabbitmq.cqrs.json
