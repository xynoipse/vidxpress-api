const { Rental } = require('../../../models/Rental');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../../../app');
const request = supertest(app);

describe('/api/returns', () => {
  let customerId;
  let movieId;
  let rental;

  beforeEach(async () => {
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
    const res = await request
      .post('/api/returns')
      .send({ customerId, movieId });

    expect(res.status).toBe(401);
  });
});
