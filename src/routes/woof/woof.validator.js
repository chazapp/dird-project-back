const validate = require('koa-joi-validate');
const joi = require('joi');

exports.woofValidator = validate({
  body: {
    text: joi.string().required(),
  },
});
