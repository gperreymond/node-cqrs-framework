#!/bin/sh

set -a
clear

sudo true

# start dockers
sudo docker-compose --file dockers/deve/docker-compose.yml up
