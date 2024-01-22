
FROM node:18.16.0

WORKDIR /apps/thedancingpony_dishservice

COPY package*.json ./
COPY yarn.lock ./

# install yarn in the image
# RUN npm install -g yarn

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]