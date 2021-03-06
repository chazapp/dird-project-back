const Router = require('koa-router');
const validate = require('koa-joi-validate');
const joi = require('joi');
const findHashtags = require('find-hashtags');

const jwt = require('../jwt');
const db = require('../db');

const router = new Router();

const woofValidator = validate({
  body: {
    text: joi.string().required(),
  },
});

async function findUser(params) {
  return db.User.findOne(params);
}

router.post('/woof', woofValidator, jwt, async (ctx) => {
  const { text } = ctx.request.body;
  const accessToken = ctx.request.get('Authorization').replace('Bearer ', '');
  const currentUser = await findUser({ accessTokens: accessToken });
  if (currentUser != null) {
    const hashtags = findHashtags(text);
    const woof = new db.Woof({
      handle: currentUser.handle,
      text,
      hashtags,
    });
    woof.save();
    currentUser.woofs.push(woof.id);
    currentUser.save();
    ctx.response.status = 201;
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
      const obj = db.Woof.findOne({ _id: user.woofs[i] }).then(item => item);
      woofArray.push(obj);
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

router.get('/woofs', jwt, async (ctx) => {
  const accessToken = ctx.request.get('Authorization').replace('Bearer ', '');
  const currentUser = await findUser({ accessTokens: accessToken });
  if (currentUser != null) {
    let i = 0;
    const woofArray = [];
    while (i < currentUser.woofs.length) {
      woofArray.push(db.Woof.findOne({ _id: currentUser.woofs[i] }));
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

router.get('/findWoofs', async (ctx) => {
  const { hashtag } = ctx.query;
  const result = await db.Woof.find({ hashtags: hashtag });
  ctx.response.status = 200;
  ctx.response.body = result;
});

module.exports = router;
