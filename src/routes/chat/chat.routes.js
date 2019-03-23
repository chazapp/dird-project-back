const Router = require('koa-router');
const { conversationValidator } = require('./chat.validator');
const {
  getConversation,
  postConversation,
  getConversationById,
  postConversationById,
} = require('./chat.controllers');

const jwt = require('../../jwt');
const db = require('../../db');

const router = new Router();

router.get('/conversations', jwt, getConversation);
router.post('/conversation', jwt, conversationValidator, postConversation);
router.get('/conversations/:id', jwt, getConversationById);
router.post('/conversations/:id', jwt, postConversationById);

module.exports = router;
