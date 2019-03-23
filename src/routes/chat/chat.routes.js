const Router = require('koa-router');
const { conversationValidator } = require('./chat.validator');

const jwt = require('../../jwt');
const db = require('../../db');

const router = new Router();

router.get('/conversations', jwt, async (ctx) => {
  const accessToken = ctx.request.get('Authorization').replace('Bearer ', '');
  const currentUser = await db.User.findOne({ accessTokens: [accessToken] });
  if (currentUser != null) {
    const conversations = await db.Conversation.find({ handles: currentUser.handle });
    ctx.response.body = {
      status: 'success',
      conversations,
    };
    ctx.response = 200;
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
    const conversation = new db.Conversation();
    const message = new db.Message({ handle: currentUser.handle, txt });
    await message.save();
    conversation.handles = [currentUser.handle, targetHandle];
    conversation.messages = [message];
    await conversation.save();
    console.log(conversation);
    ctx.response.status = 200;
    ctx.response.body = {
      status: 'success',
      conversation_id: conversation.id,
    };
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

router.post('/conversations/:id', jwt, async (ctx) => {
  const { id } = ctx.params;
  const { txt } = ctx.request.body;

  const accessToken = ctx.request.get('Authorization').replace('Bearer ', '');
  const currentUser = await db.User.findOne({ accessTokens: [accessToken] });
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    const conversation = await db.Conversation.findOne({ _id: id });
    if (conversation != null) {
      const message = new db.Message({ txt, handle: currentUser.handle });
      message.save();
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
