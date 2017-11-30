.PHONY: up down test coverage-publish

up:
	docker-compose up -d;

down:
	docker-compose down

test:
	rm -rf coverage;
	npm run test:standard;
	npm run test:coverage;

coverage-publish:
	npm run coverage:publish;
