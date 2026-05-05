const { json } = require("express");
const Movie = require("../../models/movieModel");

const movie = async(req, res) => {
    try {
        const { image, name, description, releaseDate, price } = req.body;
        if (!image || !name || !description || !releaseDate || !price) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newMovie = {
            image,
            name,
            description,
            releaseDate,
            price
        };

        const movieData = await Movie.create(newMovie);
        res.status(201).json({ message: "Movie created successfully", movie: movieData });
        
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error",error: err.message });
    }
};

const getMovies = async(req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json({ movies });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};
module.exports = {
    movie,
    getMovies
}