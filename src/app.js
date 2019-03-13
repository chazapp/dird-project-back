require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const swagger = require('swagger2');
const { ui } = require('swagger2-koa');
const cors = require('@koa/cors');

const jwt = require('./jwt');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const woofRouter = require('./routes/woof');
const chatRouter = require('./routes/chat');

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(cors());

if (process.env.NODE_ENV !== 'test') {
  const document = swagger.loadDocumentSync('./swagger.yaml');
  app.use(ui(document, '/swagger'));
  app.use(logger());
}

router.get('/', (ctx) => {
  ctx.body = 'Hello World!';
});

app.use(router.routes());
app.use(authRouter.routes());
app.use(profileRouter.routes());
app.use(woofRouter.routes());
app.use(chatRouter.routes());
app.use(router.allowedMethods());
app.use(jwt);

const server = app.listen(3000);

module.exports = server;
