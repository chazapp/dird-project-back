const validate = require('koa-joi-validate');
const joi = require('joi');

exports.conversationValidator = validate({
  body: {
    targetHandle: joi.string().required(),
    txt: joi.string().required(),
  },
});
