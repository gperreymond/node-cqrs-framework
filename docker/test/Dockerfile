# node version
FROM mhart/alpine-node:6

# create app directory
RUN mkdir -p /usr/app
WORKDIR /usr/app

# add bash to the docker container
RUN apk add --update bash && rm -rf /var/cache/apk/*

# files
COPY mocha.opts /usr/app
COPY package.json /usr/app
COPY index.js /usr/app

# directories
ADD example /usr/app/example
ADD lib /usr/app/lib
ADD test /usr/app/test

# execution
COPY docker/test/docker-entrypoint.sh /usr/app/entrypoint.sh
ENTRYPOINT ["/usr/app/entrypoint.sh"]
RUN chmod +x /usr/app/entrypoint.sh

CMD [ "npm-test" ]
