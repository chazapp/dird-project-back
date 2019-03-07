require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const swagger = require('swagger2');
const { ui } = require('swagger2-koa');

const jwt = require('./jwt');
const db = require('./db');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

if (process.env.NODE_ENV !== 'test') {
  const document = swagger.loadDocumentSync('./swagger.yaml');
  app.use(ui(document, '/swagger'));
  app.use(logger());
}

router.get('/', (ctx) => {
  ctx.body = 'Hello World!';
});

const findUser = async function findUser(params) {
  return db.User.find(params);
};

app.use(router.routes());
app.use(authRouter.routes());
app.use(profileRouter.routes());
app.use(router.allowedMethods());
app.use(jwt);

const server = app.listen(3000);

module.exports = server;
module.exports.findUser = findUser;
