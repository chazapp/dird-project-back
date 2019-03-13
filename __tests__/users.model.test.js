const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');

const profileRoute = require('../src/routes/profile');
const User = require('../src/db/models/users');

describe('Profile route', () => {
  beforeEach(() => {
    sinon.stub(User, 'findOne');
  });

  afterEach(() => {
    User.findOne.restore();
  });

  it('should create user', (done) => {
    // need to declare expected result in DB
    const profile1 = {
      handle: 'test1',
      email: 'email@test.fr',
      password: 'secret',
    };

    // yield results
    User.find.yields(null, profile1);
    const req = { params: { } };
    const res = {
      send: sinon.stub(),
    };

    // test route
    // profileRoute.getProfile(req, res);

    sinon.assert.calledWith(res.send, profile1);
  });
});
