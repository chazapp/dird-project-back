const Router = require('koa-router');

const app = require('../app');
const jwt = require('../jwt');

const router = new Router();

router.get('/users', async (ctx) => {
  ctx.body = await app.findUser({});
});

router.get('/profile', jwt, async (ctx) => {
  const accessToken = ctx.request.get('Authorization').replace('Bearer ', '');
  const currentUser = await app.findUser({ accessTokens: [accessToken] });

  ctx.body = currentUser;
});

module.exports = router;
