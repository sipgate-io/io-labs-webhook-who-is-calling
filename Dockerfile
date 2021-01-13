FROM node:buster
RUN mkdir /app
WORKDIR /app
COPY . .
RUN npm i
RUN npm run init_db
CMD ["npm", "start"]
