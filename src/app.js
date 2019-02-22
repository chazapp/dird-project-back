const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');


const app = new Koa();
const router = new Router();

router.get('/', (ctx) => {
  ctx.body = 'Hello World!';
});

app.use(router.routes());
app.use(logger());
app.use(router.allowedMethods());
const server = app.listen(3000);

module.exports = server;
