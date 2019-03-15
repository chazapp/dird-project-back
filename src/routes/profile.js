const Router = require('koa-router');
const busboy = require('koa-busboy');
const fs = require('fs');

const app = require('../app');
const jwt = require('../jwt');
const db = require('../db');

const router = new Router();

const uploader = busboy({});

router.get('/users', async (ctx) => {
  ctx.body = await app.findUser({});
});

router.get('/profile', jwt, async (ctx) => {
  const accessToken = ctx.request.get('Authorization').replace('Bearer ', '');
  const currentUser = await db.User.findOne({ accessTokens: accessToken });
  if (currentUser) {
    ctx.response.status = 200;
    ctx.response.body = {
      status: 'success',
      email: currentUser.email,
      handle: currentUser.handle,
    };
  } else {
    ctx.response.status = 404;
    ctx.response.body = {
      status: 'failed',
    };
  }
});

router.post('/profile/picture', jwt, uploader, async (ctx) => {
  const accessToken = ctx.request.get('Authorization').replace('Bearer ', '');
  const currentUser = await db.User.findOne({ accessTokens: accessToken });
  const pictureFile = ctx.request.files[0];
  const bitmap = await fs.readFileSync(pictureFile.path);
  currentUser.pictureB64 = Buffer.from(bitmap).toString('base64');
  currentUser.save();
  ctx.response.status = 200;
  ctx.response.body = {
    status: 'success',
    message: 'Successfully uploaded picture.',
    pictureB64: currentUser.pictureB64,
  };
});

router.get('/profile/picture', jwt, async (ctx) => {
  const accessToken = ctx.request.get('Authorization').replace('Bearer ', '');
  const currentUser = await db.User.findOne({ accessTokens: accessToken });
  ctx.response.status = 200;
  ctx.response.body = currentUser.pictureB64;
});

router.get('/:handle/picture', async (ctx) => {
  const { handle } = ctx.params;
  const targetUser = await db.User.findOne({ handle });
  if (targetUser) {
    ctx.response.status = 200;
    ctx.response.body = {
      status: 'success',
      pictureURL: targetUser.pictureB64,
    };
  } else {
    ctx.response.status = 404;
    ctx.response.body = {
      status: 'failed',
      message: 'Could not find user with given handle.',
    };
  }
});


module.exports = router;
