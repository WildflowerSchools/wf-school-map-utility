# wf-school-map-utility

## Dev

### Run Server (docker)

    docker build . -t wf-school-map-utility
    docker run --env-file ./.env -p 80:80 wf-school-map-utility

### Run Server (locally)

    npm run server

### Run Client (locally)

    npm run client

## Production

### Server Publish

Push to Docker Hub

    just docker-push

### Client API Publish

Push to NPM

    just npm-push

Find clientJS at:

    https://unpkg.com/wf-school-map-utility-test@<<VERSION>>/dist/wf-school-map-utility.<<VERSION>>.js