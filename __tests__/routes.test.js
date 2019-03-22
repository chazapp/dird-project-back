const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('expect');
const app = require('../src/app');

chai.use(chaiHttp);
const server = app.listen(3000);
let currentToken = '';

describe('basic route tests', () => {
  before(async () => {
  });

  after(() => {
    server.close();
  });

  it('should get home and 200 /', (done) => {
    chai
      .request(server)
      .get('/')
      .end((err, response) => {
        expect(response.status)
          .toEqual(200);
        expect(response.text)
          .toContain('Hello World!');
        done();
      });
  });

  it('should register a user', (done) => {
    chai
      .request(server)
      .post('/register')
      .send({
        handle: 'shad',
        password: 'password',
        email: 'shad@chaz.pro',
      })
      .end((err, response) => {
        if (response.status === 409) response.status = 201;
        expect(response.status)
          .toEqual(201);
        done();
      });
  });

  it('should auth user', (done) => {
    chai
      .request(server)
      .post('/auth')
      .send({
        email: 'shad@chaz.pro',
        password: 'password',
      })
      .end((err, response) => {
        expect(response.status)
          .toEqual(200);
        const { token } = response.body;
        currentToken = token;
        done();
      });
  });

  it('should get the current user profile', (done) => {
    chai
      .request(server)
      .get('/profile')
      .set('Authorization', `Bearer ${currentToken}`)
      .end((err, response) => {
        expect(response.status)
          .toEqual(200);
        done();
      });
  });

  it('should get current user conversations', (done) => {
    chai
      .request(server)
      .get('/conversations')
      .set('Authorization', `Bearer ${currentToken}`)
      .end((err, response) => {
        expect(response.status)
          .toEqual(200);
        done();
      });
  });

  it('should create a conversation', (done) => {
    chai
      .request(server)
      .post('/conversation')
      .set('Authorization', `Bearer ${currentToken}`)
      .send({
        targetHandle: 'Foo',
        txt: 'Hello Foobar',
      })
      .end((err, response) => {
        expect(response.status).toEqual(201);
        done();
      });
  });
});
