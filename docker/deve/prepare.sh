#!/bin/sh

set -a
clear

# start dockers
docker-compose --file docker/deve/docker-compose.yml up -d
