FROM node:19-alpine

WORKDIR /

COPY ./package.json ./

COPY . .

RUN npm install

EXPOSE 4000

CMD ["node", "server.js"]