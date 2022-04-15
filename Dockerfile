FROM node:16-alpine

ARG WORK_DIR=/app

WORKDIR $WORK_DIR
COPY public public
COPY src src
COPY package.json .
COPY tsconfig.json .
COPY yarn.lock .

RUN yarn install

ENTRYPOINT ["yarn", "start"]
