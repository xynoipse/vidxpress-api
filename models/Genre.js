const Joi = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const genreSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
});

exports.genreSchema = genreSchema;
exports.Genre = mongoose.model('Genre', genreSchema);

exports.validate = (genre) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required()
  });

  return schema.validate(genre);
}
