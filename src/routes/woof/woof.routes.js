const Router = require('koa-router');
const { woofValidator } = require('./woof.validator');

const jwt = require('../../jwt');
const db = require('../../db');

const router = new Router();

async function findUser(params) {
  return db.User.findOne(params);
}

router.post('/woof', woofValidator, jwt, async (ctx) => {
  const { text } = ctx.request.body;
  const accessToken = ctx.request.get('Authorization').replace('Bearer ', '');
  const currentUser = await findUser({ accessTokens: accessToken });
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

router.get('/:handle/woofs', async (ctx) => {
  const { handle } = ctx.params;
  const user = await db.User.findOne({ handle });
  if (user != null) {
    let i = 0;
    const woofArray = [];
    while (i < user.woofs.length) {
      woofArray.push(db.Woof.findOne({ _id: user.woofs[i] }));
      i += 1;
    }
    ctx.response.status = 200;
    ctx.response.body = await Promise.all(woofArray);
  } else {
    ctx.response.status = 404;
    ctx.response.body = {
      status: 'failed',
      message: 'Could not find user for given handle.',
    };
  }
});

module.exports = router;