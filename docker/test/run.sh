#!/bin/sh

set -a
clear

# start dockers
docker-compose --file docker/test/docker-compose.yml up
