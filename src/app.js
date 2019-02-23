const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const swagger = require('swagger2');
const { ui } = require('swagger2-koa');


const app = new Koa();
const router = new Router();

if (process.env.NODE_ENV !== 'test') {
  const document = swagger.loadDocumentSync('./swagger.yaml');
  app.use(ui(document, '/swagger'));
}

router.get('/', (ctx) => {
  ctx.body = 'Hello World!';
});

app.use(router.routes());
app.use(logger());
app.use(router.allowedMethods());

const server = app.listen(3000);

module.exports = server;
