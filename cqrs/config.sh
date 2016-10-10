#!/bin/sh

set -a
clear

sudo true

docker_ip() {
  export $1=$(sudo docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "$2")
}

# set dockers ip
docker_ip RETHINKDB_HOST rethinkdb_cqrs_deve
docker_ip RABBITMQ_HOST rabbitmq_cqrs_deve

# get dockers ip
echo RETHINKDB_HOST=$RETHINKDB_HOST
echo RABBITMQ_HOST=$RABBITMQ_HOST
