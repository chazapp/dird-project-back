const validate = require('koa-joi-validate');
const joi = require('joi');

exports.registerValidator = validate({
  body: {
    handle: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
  },
});

exports.authValidator = validate({
  body: {
    email: joi.string().required(),
    password: joi.string().required(),
  },
});
