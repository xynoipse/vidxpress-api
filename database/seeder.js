const { Genre } = require('../models/Genre');
const { Movie } = require('../models/Movie');
const fs = require('fs');
const config = require('config');
const mongoose = require('mongoose');

const db = process.env.MONGO_URI || config.get('mongoURI');
mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const genres = JSON.parse(
  fs.readFileSync(`${__dirname}/data/genres.json`, 'utf-8')
);

const movies = JSON.parse(
  fs.readFileSync(`${__dirname}/data/movies.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Genre.insertMany(genres);

    for (let movie of movies) {
      let genre = await Genre.findOne({ name: movie.genre });
      if (!genre) genre = await Genre.create({ name: movie.genre });
      movie.genre = { _id: genre.id, name: movie.genre };
      await Movie.create(movie);
    }

    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

const deleteData = async () => {
  try {
    await Genre.deleteMany();
    await Movie.deleteMany();
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
