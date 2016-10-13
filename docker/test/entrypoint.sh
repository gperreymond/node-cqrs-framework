#!/bin/sh

run_test() {
  npm install
  npm test
}

if [ "$1" = 'run-test' ]; then
  run_test
fi
