#!/bin/sh

set -a
clear

# start dockers
docker-compose --file dockers/deve/docker-compose.yml up -d
