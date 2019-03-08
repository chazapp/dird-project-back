const Router = require('koa-router');

const jwt = require('../jwt');
const db = require('../db');

const router = new Router();

async function findUser(params) {
  return db.User.findOne(params);
}

router.post('/woof', jwt, async (ctx) => {
  const { text } = ctx.request.body;
  const accessToken = ctx.request.get('Authorization').replace('Bearer ', '');
  const currentUser = await findUser({ accessTokens: [accessToken] });
  if (currentUser != null) {
    const woof = new db.Woof({
      handle: currentUser.handle,
      text,
    });
    woof.save();
    currentUser.woofs.push(woof.id);
    currentUser.save();
    ctx.response.status = 200;
    ctx.response.body = {
      status: 'success',
      message: 'Successfully posted Woof.',
      woofID: woof.id,
    };
  } else {
    ctx.response.status = 401;
    ctx.response.body = {
      status: 'failed',
      message: 'Could not authenticate user.',
    };
  }
});

router.get('/woof/:id', async (ctx) => {
  const { id } = ctx.params;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    const woof = await db.Woof.findOne({ _id: id });
    if (woof != null) {
      ctx.response.status = 200;
      ctx.response.body = {
        status: 'success',
        handle: woof.handle,
        text: woof.text,
      };
    } else {
      ctx.response.status = 404;
      ctx.response.body = {
        status: 'failed',
        message: 'Could not find woof for given ID.',
      };
    }
  } else {
    ctx.response.status = 400;
    ctx.response.body = {
      status: 'failed',
      message: 'Invalid supplied ID.',
    };
  }
});

module.exports = router;
