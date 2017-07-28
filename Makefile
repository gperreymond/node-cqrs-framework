.PHONY: default install tests coverage up

default: install

up:
	docker-compose up -d;

install:
	npm install;

tests:
	rm -rf coverage;
	npm run test:standard;
	npm run test:coverage;

coverage:
	npm run coverage:publish
