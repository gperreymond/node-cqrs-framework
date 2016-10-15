#!/bin/sh

# script/ci-bootstrap-rethinkdb - make sure all required dependencies are setup

# exit on sub-module failure
set -e

# move to parent dir
cd "$(dirname "$0")/.."

# ------

echo "Boostrapping build"
date "+%H:%M:%S"

echo "--------- "

# capture docker info for debug
docker info

echo "--------- "
echo "Stop if exists rethinkdb"
docker stop cqrs_rethinkdb || echo 'no container to stop'
echo "Remove if exists rethinkdb"
docker rm cqrs_rethinkdb || echo 'no container to delete'

echo "--------- "
echo "Setting up rethinkdb"

# startup rethink db
docker pull library/rethinkdb
docker run -d --name cqrs_rethinkdb -p 29015:29015 -p 28015:28015 -p 8080:8080 library/rethinkdb

echo "--------- "

# capture docker process for debug
docker ps -a

echo "--------- "
echo "Waiting for rethinkdb"

# wait for rethink to be ready
check_status() {

    max=30
    count=0
    while [ $(curl -sLI -w "%{http_code}\n" -X GET $1 -o /dev/null) -ne 200 ]
    do
        # check if max retries hit
        if [ $count -eq $max ] ; then
          echo "Max attempts $max reached"
          exit 1
        fi

        count=$((count+1))

        echo "Failed to connect to $1"
        sleep 1
    done
}
check_status "http://localhost:8080/"

echo "--------- "
echo "Bootstrapping done!"
