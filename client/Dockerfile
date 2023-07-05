FROM node:16-alpine
RUN npm install -g nodemon
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
CMD ["npm", "run", "dev"]