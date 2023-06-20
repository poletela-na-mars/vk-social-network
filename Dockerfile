FROM node:18-alpine

WORKDIR /usr/src/vk-network

COPY package*.json ./

RUN npm install --production
COPY . .
EXPOSE 3000

CMD ["npm", "start"]
