FROM node:16.7.0-alpine

WORKDIR /app

ENV PATH=/app/node_modules/.bin:$PATH
ENV PORT=80

COPY package.json /app/package.json
COPY package-lock.json /app
RUN npm install

COPY backend/ /app/

CMD node bin/www
