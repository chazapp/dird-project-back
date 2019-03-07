const Router = require('koa-router');
const bcrypt = require('bcrypt');
const tokenGen = require('jsonwebtoken');

const app = require('../app');
const db = require('../db');

const router = new Router();

async function findUser(params) {
  return db.User.find(params);
}

router.post('/register', async (ctx) => {
  const { handle, email, password } = ctx.request.body;
  // Verify handle, email not already exists :
  const alreadyExistingUser = await findUser({ email, handle });
  if (alreadyExistingUser.length > 0) {
    ctx.response.status = 409;
    ctx.response.body = {
      status: 'failed',
      message: 'User already exists.',
    };
  } else {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const token = tokenGen.sign({ role: 'user' }, process.env.JWT_SECRET);
    const user = new db.User({
      handle,
      email,
      hashedPassword,
      accessTokens: [token],
    });
    user.save();
    ctx.response.status = 200;
    ctx.response.body = {
      status: 'success',
      message: 'User successfully created.',
      token,
    };
  }
});

router.post('/auth', async (ctx) => {
  const { email, password } = ctx.request.body;
  const users = await app.findUser({ email });
  if (users.length > 0) {
    const user = users[0];
    if (bcrypt.compareSync(password, user.hashedPassword)) {
      const token = tokenGen.sign({ role: 'user' }, process.env.JWT_SECRET);
      ctx.response.status = 200;
      ctx.response.body = {
        status: 'success',
        message: 'User successfully authenticated.',
        token,
      };
    } else {
      ctx.response.status = 401;
      ctx.response.body = {
        status: 'failed',
        message: 'Wrong password.',
      };
    }
  } else {
    ctx.response.body = {
      status: 'failed',
      message: 'User not found.',
    };
    ctx.response.status = 400;
  }
});

module.exports = router;
