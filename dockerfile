FROM mhart/alpine-node:6

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# port to expose
EXPOSE 5858
