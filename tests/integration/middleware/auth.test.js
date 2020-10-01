const { User } = require('../../../models/User');
const { Genre } = require('../../../models/Genre');
const supertest = require('supertest');
const app = require('../../../app');
const request = supertest(app);

describe('auth middleware', () => {
  beforeEach(() => {
    token = new User().generateAuthToken();
  });
  afterEach(async (done) => {
    await Genre.deleteMany();
    done();
  });

  let token;

  const exec = () => {
    return request
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name: 'genre1' });
  }

  it('should return 401 if no token is provided', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if token is invalid', async () => {
    token = 'a';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if token is valid', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});
