FROM node:16-alpine
RUN npm install -g nodemon
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY .env.local ./
COPY config.ts ./
COPY index.html ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./
COPY yarn.lock ./
COPY .vite/ ./
COPY ./ ./
RUN npm i

CMD ["npm", "run", "dev"]