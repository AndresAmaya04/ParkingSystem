FROM node:16-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

RUN npm install node-fetch

COPY . .

EXPOSE 4949

CMD [ "node", "Round_robin.js" ]
