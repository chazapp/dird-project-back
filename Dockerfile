FROM node:latest
ENV NPM_CONFIG_LOGLEVEL warn

COPY package.json package.json
RUN npm install && npm install pm2

COPY . .

CMD npm run prod
EXPOSE 3000
