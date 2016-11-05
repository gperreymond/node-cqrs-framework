#!/bin/bash

# -----------------------
# run tests
# -----------------------

# exit on sub-module failure
set -e

export CODACY_PROJECT_TOKEN=5705316ff8f6499d9373f0f76340bfa5
rm -rf coverage

npm run test:coverage

cat coverage/lcov.info | node_modules/.bin/codacy-coverage
