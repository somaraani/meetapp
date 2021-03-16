FROM node:14
WORKDIR /usr/src/app/shared
COPY ./shared .
WORKDIR /usr/src/app/server
COPY . .
COPY package*.json ./
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]