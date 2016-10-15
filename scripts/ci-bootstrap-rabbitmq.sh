#!/bin/sh

# script/ci-bootstrap-rabbitmq - make sure all required dependencies are setup

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
echo "Setting up rabbitmq"

# startup rethink db
docker pull library/rabbitmq:management
docker run -d --name cqrs_rabbitmq -p 5672:5672 -p 15672:15672 library/rabbitmq:management

echo "--------- "

# capture docker process for debug
docker ps -a

echo "--------- "
echo "Waiting for rabbitmq"

# wait for rabbitmq to be ready
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
check_status "http://localhost:15672/"

echo "--------- "
echo "Bootstrapping done!"
