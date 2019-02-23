require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const db = require('./models');

const app = new Koa();
const router = new Router();

router.get('/', (ctx) => {
  ctx.body = 'Hello World!';
});

router.post('/subscribe', (ctx) => {
  const form = ctx.request.body;

  console.log('ctx.request.body = ', form);
});

app.use(router.routes());
app.use(logger());
app.use(bodyParser());
app.use(router.allowedMethods());

const server = app.listen(3000);

module.exports = server;
