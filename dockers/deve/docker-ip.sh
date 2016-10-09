#!/bin/sh

set -a
clear

sudo true

docker_ip() {
  export $1=$(sudo docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "$2")
}

# set dockers ip
docker_ip DATABASE_RETHINKDB_HOST deve-rethinkdb
docker_ip DOCKER_IP_CONTAINER_RABBITMQ deve-rabbitmq

# get dockers ip
echo DATABASE_RETHINKDB_HOST=$DATABASE_RETHINKDB_HOST
echo DOCKER_IP_CONTAINER_RABBITMQ=$DOCKER_IP_CONTAINER_RABBITMQ
