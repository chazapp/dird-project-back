const Router = require('koa-router');
const validate = require('koa-joi-validate');
const joi = require('joi');

const jwt = require('../jwt');
const db = require('../db');

const router = new Router();

const conversationValidator = validate({
  body: {
    targetHandle: joi.string().required(),
    txt: joi.string().required(),
  },
});

router.get('/conversations', jwt, async (ctx) => {
  const accessToken = ctx.request.get('Authorization').replace('Bearer ', '');
  const currentUser = await db.User.findOne({ accessTokens: accessToken });
  if (currentUser != null) {
    const conversations = await db.Conversation.find({ handles: currentUser.handle });
    const arr = [];
    conversations.forEach((doc) => {
      const targetHandle = doc.handles[0] === currentUser.handle ? doc.handles[1] : doc.handles[0];
      const latestMessage = doc.messages[doc.messages.length - 1];
      arr.push({
        targetHandle,
        conversation_id: doc.id,
        latestMessage,
      });
    });
    ctx.response.status = 200;
    ctx.response.body = {
      status: 'success',
      conversations: arr,
    };
  } else {
    ctx.response.status = 401;
    ctx.response.body = {
      status: 'failed',
      message: 'Could not authenticate user.',
    };
  }
});

router.post('/conversation', jwt, conversationValidator, async (ctx) => {
  const { targetHandle, txt } = ctx.request.body;
  const accessToken = ctx.request.get('Authorization').replace('Bearer ', '');
  const currentUser = await db.User.findOne({ accessTokens: accessToken });
  if (currentUser) {
    let conversation = await db.Conversation
      .findOne({ handles: [currentUser.handle, targetHandle] });
    if (conversation == null) {
      conversation = new db.Conversation();
      const message = new db.Message({
        handle: currentUser.handle,
        txt,
      });
      await message.save();
      conversation.handles = [currentUser.handle, targetHandle];
      conversation.messages = [message];
      await conversation.save();
      ctx.response.status = 201;
      ctx.response.body = {
        status: 'success',
        conversationID: conversation.id,
      };
    } else {
      ctx.response.status = 409;
      ctx.response.body = {
        status: 'failure',
        message: 'Conversation already exists.',
        conversation_id: conversation.id,
      };
    }
  } else {
    ctx.response.status = 401;
    ctx.response.body = {
      status: 'failed',
      message: 'Could not authenticate user.',
    };
  }
});

router.get('/conversations/:id', jwt, async (ctx) => {
  const { id } = ctx.params;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    const conversation = await db.Conversation.findOne({ _id: id });
    if (conversation != null) {
      ctx.response.status = 200;
      ctx.response.body = {
        status: 'success',
        messages: conversation.messages,
      };
    } else {
      ctx.response.status = 404;
      ctx.response.body = {
        status: 'failed',
        message: 'Could not find conversation for given ID.',
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

router.post('/conversation/:id', jwt, async (ctx) => {
  const { id } = ctx.params;
  const { txt } = ctx.request.body;

  const accessToken = ctx.request.get('Authorization').replace('Bearer ', '');
  const currentUser = await db.User.findOne({ accessTokens: accessToken });
  if (id.match(/^[0-9a-fA-F]{24}$/) && currentUser != null) {
    const conversation = await db.Conversation.findOne({ _id: id });
    if (conversation != null) {
      const message = new db.Message({ txt, handle: currentUser.handle });
      message.save();
      ctx.response.status = 201;
      ctx.response.body = {
        status: 'success',
      };
    } else {
      ctx.response.status = 404;
      ctx.response.body = {
        status: 'failed',
        message: 'Could not find conversation for given ID.',
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

module.exports = router;
