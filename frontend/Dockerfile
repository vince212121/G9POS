FROM node:16

WORKDIR /app/frontend

COPY package.json .
COPY package-lock.json .

RUN npm install 

COPY . .