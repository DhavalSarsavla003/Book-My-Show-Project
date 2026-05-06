const express = require("express");
const router = express.Router();
const {
  movie,
  getMovies,
} = require("../controllers/moiveControllers/movieController");
const { createBooking, getBookedSeats, getAllBookings, cancelBooking } = require("../controllers/bookingControllers/bookingController");

router.post("/movies", movie);
router.get("/movies", getMovies);
router.post("/bookings", createBooking);
router.get("/bookings/:movieId", getBookedSeats);
router.get("/all-bookings", getAllBookings);
router.delete("/bookings/:bookingId", cancelBooking);

module.exports = router;
