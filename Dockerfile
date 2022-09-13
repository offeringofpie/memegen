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

# COPY . /usr/src/bot

EXPOSE 4000

CMD netlify functions:build --src netlify/functions