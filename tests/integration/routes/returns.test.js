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

  it('should work!', async () => {
    const result = await Rental.findById(rental.id);
    expect(result).not.toBeNull();
  });
});
