#!/bin/sh

# -----------------------
# make sure all required dependencies are setup
# -----------------------

# exit on sub-module failure
set -e

# declare vars
LABEL_SCRIPT=$1
DOCKER_NAME=$2
DOCKER_OPTIONS=$3
DOCKER_LIBRARY=$4

# move to parent dir
cd "$(dirname "$0")/.."

echo " "
echo "------------------"
echo "Boostrapping $LABEL_SCRIPT"
echo "Start: $(date "+%H:%M:%S")"
echo "------------------"

# capture docker info for debug
# docker info
echo "Stop if exists $DOCKER_NAME"
docker stop $DOCKER_NAME || echo 'no container to stop'
echo "Remove if exists $DOCKER_NAME"
docker rm $DOCKER_NAME || echo 'no container to delete'

echo "Setting up $LABEL_SCRIPT"

# startup
docker pull $DOCKER_LIBRARY
docker run -d --name $DOCKER_NAME $DOCKER_OPTIONS $DOCKER_LIBRARY

# capture docker process for debug
# docker ps -a
echo "Waiting for $LABEL_SCRIPT"

# wait for container to be ready
check_status() {
  max=30
  count=0
  INSPECT=false
  while $INSPECT == false
  do
    # check if max retries hit
    if [ $count -eq $max ] ; then
      echo "Max attempts $max reached"
      exit 1
    fi
    count=$((count+1))
    OUTPUT=$(docker inspect -f {{.State.Running}} $DOCKER_NAME)
    echo "... $LABEL_SCRIPT not running"
    sleep 1
  done
}
check_status

echo "------------------"
echo "Finish: $(date "+%H:%M:%S")"
echo "Bootstrapping done!"
echo "------------------"
echo " "
