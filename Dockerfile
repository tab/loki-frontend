FROM node:20.18.1-alpine3.21 as builder

WORKDIR /frontend

ENV NODE_ENV=development

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./

FROM builder as development-frontend

CMD ["yarn", "dev"]
