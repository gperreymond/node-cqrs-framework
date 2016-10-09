#!/bin/sh

set -a
clear

sudo true

docker_ip() {
  export $1=$(sudo docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "$2")
}

# set dockers ip
docker_ip DOCKER_IP_CONTAINER_RETHINKDB deve-rethinkdb
docker_ip DOCKER_IP_CONTAINER_RABBITMQ deve-rabbitmq

# get dockers ip
echo DOCKER_IP_CONTAINER_RETHINKDB=$DOCKER_IP_CONTAINER_RETHINKDB
echo DOCKER_IP_CONTAINER_RABBITMQ=$DOCKER_IP_CONTAINER_RABBITMQ
