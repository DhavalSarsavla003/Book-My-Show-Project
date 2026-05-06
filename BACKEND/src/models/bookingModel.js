const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movies', required: true },
    movieName: { type: String, required: true },
    userName: { type: String, required: true },
    seats: { type: [Number], required: true },
    totalPrice: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now }
});

const Booking = mongoose.model("Bookings", bookingSchema);
module.exports = Booking;
