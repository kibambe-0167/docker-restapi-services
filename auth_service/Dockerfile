
FROM node:18.16.0

WORKDIR /apps/thedancingpony_authservice

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]