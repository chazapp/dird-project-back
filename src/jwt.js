const jwt = require('koa-jwt');

const SECRET = process.env.JWT_SECRET;
const jwtInstance = jwt({ secret: SECRET });

module.exports = jwtInstance;
