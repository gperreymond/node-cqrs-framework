#!/bin/bash
set -e

if [ "$1" = 'npm-test' ]; then
	npm install
  npm test
fi

exec "$@"
