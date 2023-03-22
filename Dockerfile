FROM node:16-alpine AS BUILD_IMAGE

# couchbase sdk requirements
RUN apk update && apk add curl bash && rm -rf /var/cache/apk/*

# install node-prune (https://github.com/tj/node-prune)
# RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

WORKDIR /usr/src/app

COPY package.json ./
COPY /views ./

# install dependencies
RUN npm install

COPY . .

# build application
RUN npm run build

# remove development dependencies
RUN npm prune --production

# run node prune
# RUN /usr/local/bin/node-prune

# remove unused dependencies

FROM node:16-alpine

WORKDIR /usr/src/app

# copy from build image
COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/app/views ./views

EXPOSE 7651

CMD [ "node", "./dist/main.js" ]