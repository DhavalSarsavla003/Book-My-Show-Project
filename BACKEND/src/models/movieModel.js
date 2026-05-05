const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    image: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    releaseDate: { type: Date, required: true },
});

const Movie = mongoose.model("Movies", movieSchema);
module.exports = Movie;