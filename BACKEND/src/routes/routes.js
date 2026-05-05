const express = require("express");
const router = express.Router();
const {
  movie,
  getMovies,
} = require("../controllers/moiveControllers/movieController");

router.post("/movies", movie);
router.get("/movies", getMovies);

module.exports = router;
