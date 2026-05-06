const Booking = require("../../models/bookingModel");

const getBookedSeats = async (req, res) => {
    try {
        const { movieId } = req.params;
        const bookings = await Booking.find({ movieId });
        let bookedSeats = [];
        bookings.forEach(b => {
            bookedSeats = [...bookedSeats, ...b.seats];
        });
        res.status(200).json({ bookedSeats });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ bookingDate: -1 });
        res.status(200).json({ bookings });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

const createBooking = async (req, res) => {
    try {
        const { movieId, movieName, userName, seats, totalPrice } = req.body;

        if (!movieId || !movieName || !userName || !seats || !seats.length || !totalPrice) {
            return res.status(400).json({ message: "All fields are required including user name, seats, and total price" });
        }
        
        const existingBookings = await Booking.find({ movieId });
        let bookedSeats = [];
        existingBookings.forEach(b => {
            bookedSeats = [...bookedSeats, ...b.seats];
        });

        const alreadyBooked = seats.some(seat => bookedSeats.includes(seat));
        if (alreadyBooked) {
            return res.status(400).json({ message: "One or more selected seats are already booked" });
        }

        const newBooking = {
            movieId,
            movieName,
            userName,
            seats,
            totalPrice
        };

        const bookingData = await Booking.create(newBooking);
        res.status(201).json({ message: "Booking successful", booking: bookingData });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId);
        
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const now = new Date();
        const bookingDate = new Date(booking.bookingDate);
        const diffInMs = now - bookingDate;
        const diffInHours = diffInMs / (1000 * 60 * 60);

        let refundPercentage = 0;
        if (diffInHours <= 1) {
            refundPercentage = 80;
        } else if (diffInHours <= 12) {
            refundPercentage = 50;
        } else if (diffInHours <= 24) {
            refundPercentage = 40;
        } else {
            refundPercentage = 0;
        }

        const refundAmount = (booking.totalPrice * refundPercentage) / 100;

        await Booking.findByIdAndDelete(bookingId);

        res.status(200).json({ 
            message: `Booking cancelled successfully.`, 
            refundPercentage,
            refundAmount 
        });

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

module.exports = {
    createBooking,
    getBookedSeats,
    getAllBookings,
    cancelBooking
};
