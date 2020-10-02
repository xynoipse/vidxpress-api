const { Rental } = require('../models/Rental');
const { Movie } = require('../models/Movie');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const moment = require('moment');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

router.post('/', [auth, validateRequest(validate)], async (req, res) => {
  const rental = await Rental.findOne({
    'customer._id': req.body.customerId,
    'movie._id': req.body.movieId,
  });
  if (!rental) return res.status(404).send('Rental not found');

  if (rental.dateReturned) return res.status(400).send('Return already processed.');

  rental.dateReturned = new Date();
  const rentalDays = moment().diff(rental.dateOut, 'days');
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
  await rental.save();

  await Movie.update({ _id: rental.movie._id }, {
    $inc: { numberInStock: 1 }
  });

  return res.status(200).send(rental);
});

function validate(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  });

  return schema.validate(req);
}

module.exports = router;
