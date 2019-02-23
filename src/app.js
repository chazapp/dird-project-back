const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const swagger = require('swagger2');
const { ui } = require('swagger2-koa');


const app = new Koa();
const router = new Router();

const swaggerDoc = swagger.loadDocumentSync('./swagger.yaml');

router.get('/', (ctx) => {
  ctx.body = 'Hello World!';
});

app.use(router.routes());
app.use(logger());
app.use(router.allowedMethods());
app.use(ui(swaggerDoc, '/swagger'));

const server = app.listen(3000);

module.exports = server;
