#!/bin/sh
set -e

# start dockers
docker-compose --file docker/test/docker-compose.yml up --build

# get network infos

CQRS_RETHINKDB_HOST={\"CQRS_RETHINKDB_HOST\":\"$(docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' rethinkdb.cqrs.deve)\"}
echo $CQRS_RETHINKDB_HOST > example/.rethinkdb.cqrs.env

CQRS_RABBITMQ_URL={\"CQRS_RABBITMQ_URL\":\"amqp://$(docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' rabbitmq.cqrs.deve)\"}
echo $CQRS_RABBITMQ_URL > example/.rabbitmq.cqrs.env
