FROM node:16-alpine

WORKDIR /usr/src/api1

COPY *.* ./

RUN yarn install --frozen-lockfile --network-timeout 600000

RUN yarn build

COPY . .

CMD if [ "$ENV" = "development" ]; \
      then yarn run start:dev; \
    else \
      yarn run start; fi 