FROM node:latest
ENV NPM_CONFIG_LOGLEVEL warn

COPY package.json package.json
RUN npm install

COPY . .

CMD npm start
EXPOSE 3000
