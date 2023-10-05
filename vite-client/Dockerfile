FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --force
RUN chown -R node:node /app/node_modules
COPY . .
EXPOSE 5173
CMD [ "npm", "run", "dev" ]