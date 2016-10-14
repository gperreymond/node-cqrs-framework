#!/bin/bash
set -e

if [ "$1" = 'npm-test' ]; then
	npm install
  npm test
fi

if [ "$1" = 'ping' ]; then
	ping localhost
fi

exec "$@"
