const Router = require('koa-router');

const app = require('../app');
const jwt = require('../jwt');
const db = require('../db');

const router = new Router();

async function findUser(params) {
    return db.User.findOne(params);
}

router.get('/users', async (ctx) => {
  ctx.body = await app.findUser({});
});

router.get('/profile', jwt, async (ctx) => {
  const accessToken = ctx.request.get('Authorization').replace('Bearer ', '');
  const currentUser = await findUser({ accessTokens: [accessToken] });

  ctx.body = currentUser;
});

module.exports = router;

router.post('/profile/picture', jwt, async (ctx) => {
  const accessToken = ctx.request.get('Authorization').replace('Bearer ', '');
  const currentUser = await findUser({ accessTokens: [accessToken] });
  console.log('request files : ', ctx.request.files);
  const pictureFile = ctx.request.files.picture
  currentUser.picture.data = pictureFile.data;
  currentUser.save();
  ctx.response.status = 200;
  ctx.response.body = {
    status: 'success',
    message: 'Successfully uploaded picture.',
  };
});

router.get('/profile/picture', jwt, async (ctx) => {
  const accessToken = ctx.request.get('Authorization').replace('Bearer ', '');
  const currentUser = await findUser({ accessTokens: [accessToken] });
  ctx.response.status = 200;
  ctx.response.body = currentUser.picture;
});
