.PHONY: default install test up

default: install

up:
	docker-compose up -d;

install:
	npm install;

test:
	rm -rf coverage;
	npm run test:standard;
	npm run test:coverage;
