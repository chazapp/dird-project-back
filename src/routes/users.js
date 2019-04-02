const Router = require('koa-router');
const validate = require('koa-joi-validate');
const joi = require('joi');

const jwt = require('../jwt');
const db = require('../db');

const router = new Router();

const usersValidator = validate({
  query: {
    handle: joi.string().required(),
  },
});

router.get('/users', jwt, usersValidator, async (ctx) => {
  const { handle } = ctx.query;
  const result = await db.User.find({ handle: { $regex: `${handle}.*`, $options: 'i' } });
  let i = 0;
  const resp = [];
  while (i < result.length) {
    const elem = {
      handle: result[i].handle,
      email: result[i].email,
      pictureB64: result[i].pictureB64,
    };
    resp.push(elem);
    i += 1;
  }
  ctx.response.status = 200;
  ctx.response.body = resp;
});

module.exports = router;
