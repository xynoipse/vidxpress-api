const { Rental } = require('../../../models/Rental');
const { Movie } = require('../../../models/Movie');
const { User } = require('../../../models/User');
const moment = require('moment');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../../../app');
const request = supertest(app);

describe('/api/returns', () => {
  let customerId;
  let movieId;
  let rental;
  let movie;
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

    movie = new Movie({
      _id: movieId,
      title: 'movie',
      genre: { name: 'genre' },
      numberInStock: 1,
      dailyRentalRate: 2,
    });
    await movie.save();

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
    await Movie.deleteMany();
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

  it('should return 404 if no rental found for customerId/movieId', async () => {
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it('should return 400 if return is already processed', async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if valid request', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it('should set the dateReturned if input is valid', async () => {
    await exec();

    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;
    expect(rentalInDb.dateReturned).toBeDefined();
    expect(diff).toBeLessThan(10 * 1000); // 10 seconds diff
  });

  it('should set the rentalFee if input is valid', async () => {
    rental.dateOut = moment().add(-7, 'days').toDate();
    await rental.save();

    await exec();

    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14); // days * dailyRentalRate
  });

  it('should increase movie numberInStock if input is valid', async () => {
    await exec();

    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  it('should return the rental if input is valid', async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    expect(Object.keys(res.body))
      .toEqual(expect.arrayContaining([
        'customer', 'movie', 'dateOut', 'dateReturned', 'rentalFee'
      ]));
  });
});
