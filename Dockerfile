FROM node:18-alpine
RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json .
RUN npm install
COPY config /app/config
COPY src /app/src
ENTRYPOINT ["npm","run","serve"]