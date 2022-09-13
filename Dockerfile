FROM node:alpine

RUN mkdir -p /app
WORKDIR /app

COPY . /app

RUN apk add --no-cache \
  build-base \
  g++ \
  cairo-dev \
  jpeg-dev \
  pango-dev \
  giflib-dev

RUN apk add --update  --repository http://dl-3.alpinelinux.org/alpine/edge/testing libmount ttf-dejavu ttf-droid ttf-freefont ttf-liberation fontconfig

RUN npm i -g netlify-cli

RUN npm install

RUN cp /lib/libblkid.so.1 /app/node_modules/canvas/build/Release/ && cp /lib/libmount.so.1 /app/node_modules/canvas/build/Release/ && cp /lib/libuuid.so.1 /app/node_modules/canvas/build/Release/

# COPY . /usr/src/bot

EXPOSE 4000

# CMD netlify functions:serve
CMD netlify functions:build --src netlify/functions