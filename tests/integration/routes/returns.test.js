const { Rental } = require('../../../models/Rental');
const { User } = require('../../../models/User');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../../../app');
const request = supertest(app);

describe('/api/returns', () => {
  let customerId;
  let movieId;
  let rental;
  let token;

  const exec = () => {
    return request
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  }

  beforeEach(async () => {
    token = new User().generateAuthToken();
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: 'customer',
        phone: '12345'
      },
      movie: {
        _id: movieId,
        title: 'movie',
        dailyRentalRate: 2
      }
    });

    await rental.save();
  });

  afterEach(async (done) => {
    await Rental.deleteMany();
    done();
  });

  it('should return 401 if client is not logged in', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if customerId is not provided', async () => {
    customerId = '';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 400 if movieId is not provided', async () => {
    movieId = '';

    const res = await exec();

    expect(res.status).toBe(400);
  });
});
