const Router = require('koa-router');
const multer = require('koa-multer');

const upload = multer({ storage: multer.memoryStorage() });
const jwt = require('../jwt');
const db = require('../db');

const router = new Router();

async function findUser(params) {
  return db.User.findOne(params);
}

router.get('/users', async (ctx) => {
  ctx.body = await findUser({});
});

router.get('/profile', jwt, async (ctx) => {
  const accessToken = ctx.request.get('Authorization').replace('Bearer ', '');
  const currentUser = await findUser({ accessTokens: [accessToken] });

  ctx.body = currentUser;
});

module.exports = router;

router.post('/profile/picture', jwt, upload.single('avatar'), async (ctx) => {
  const accessToken = ctx.request.get('Authorization').replace('Bearer ', '');
  const currentUser = await findUser({ accessTokens: [accessToken] });
  const { file } = ctx.req;
  const picture = {
    data: file.buffer,
    contentType: file.mimetype,
  };

  await db.User.updateOne({ accessTokens: [accessToken] }, { $set: { picture } });
});

router.get('/profile/picture/:id', jwt, async (ctx) => {
  const accessToken = ctx.request.get('Authorization').replace('Bearer ', '');
  const currentUser = await findUser({ accessTokens: [accessToken] });
  ctx.response.status = 200;
  ctx.response.body = currentUser.picture.data;
});
