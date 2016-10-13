#!/bin/sh

clear

# start dockers
docker-compose --file docker/test/docker-compose.yml up --build
