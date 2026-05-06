import React, { useEffect, useState } from "react";

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingSeats, setBookingSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [alreadyBookedSeats, setAlreadyBookedSeats] = useState([]);
  const [hasBookedBefore, setHasBookedBefore] = useState(
    localStorage.getItem("hasBookedBefore") === "true"
  );
  const [userNameInput, setUserNameInput] = useState("");
  const [allBookings, setAllBookings] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchAllBookings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/all-bookings");
      if (res.ok) {
        const data = await res.json();
        setAllBookings(data.bookings);
      }
    } catch (err) {
      console.error("Error fetching all bookings", err);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message + (data.refundPercentage > 0 ? ` Refund Amount: ₹${data.refundAmount}` : ""));
        fetchAllBookings();
      } else {
        alert("Failed to cancel: " + data.message);
      }
    } catch (err) {
      alert("Error cancelling booking: " + err.message);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);
  
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/movies");
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        const data = await response.json();
        setMovies(data.movies);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching movies:", err);
      }
    };
    fetchMovies();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const bookSelect = async (movieId) => {
    const movie = movies.find((m) => m._id === movieId);
    setSelectedMovie(movie);

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${movieId}`);
      if (response.ok) {
        const data = await response.json();
        setAlreadyBookedSeats(data.bookedSeats || []);
      }
    } catch (err) {
      console.error("Error fetching booked seats:", err);
    }

    setIsModalOpen(true);
    initializeSeats();
    setSelectedSeats([]);
  };

  const initializeSeats = () => {
    if (bookingSeats.length === 0) {
      setBookingSeats(Array.from({ length: 30 }, (_, index) => index + 1));
    }
  };



  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>
      <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
        
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 1000,
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
          }}
        >
          {isSidebarOpen ? "Close Bookings" : "View Bookings"}
        </button>

      <div
        className="movies-list"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        {movies.map((movie) => (
          <div
            key={movie._id}
            className="movie-card"
            style={{
              background: "#f8f5f5",
              border: "1px solid #ddd",
              borderRadius: "8px",
              margin: "10px",
              padding: "15px",
              width: "250px",
              boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <img
              src={movie.image}
              alt={movie.name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
            <h3 style={{ margin: "10px 0" }}>{movie.name}</h3>
            <p style={{ color: "#666", fontSize: "14px" }}>{movie.description}</p>
            <p style={{ color: "#666", fontSize: "14px" }}>
              Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
            </p>
            <p style={{ fontWeight: "bold", color: "#333" }}>
              Price: {movie.price}
            </p>
            <button
              onClick={() => bookSelect(movie._id)}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
      </div>
      
      {isSidebarOpen && (
        <div style={{ width: "350px", borderLeft: "1px solid #ddd", padding: "20px", backgroundColor: "#f9f9f9", overflowY: "auto" }}>
          <h2>Recent Bookings</h2>
          {allBookings.length === 0 ? (
            <p style={{ color: "#666" }}>No bookings yet.</p>
          ) : (
            allBookings.map(b => (
              <div key={b._id} style={{ backgroundColor: "white", padding: "15px", marginBottom: "15px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                <p style={{ margin: "5px 0" }}><strong>User:</strong> {b.userName}</p>
                <p style={{ margin: "5px 0" }}><strong>Movie:</strong> {b.movieName}</p>
                <p style={{ margin: "5px 0" }}><strong>Seats:</strong> {b.seats.join(', ')}</p>
                <p style={{ margin: "5px 0", color: "#28a745", fontWeight: "bold" }}><strong>Total:</strong> ₹{b.totalPrice}</p>
                <button 
                  onClick={() => handleCancelBooking(b._id)}
                  style={{
                    marginTop: "10px",
                    padding: "5px 10px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    width: "100%"
                  }}
                >
                  Cancel Booking
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {isModalOpen && selectedMovie && (
        <div
          className="modal"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginLeft: "10px", marginBottom: "20px" }}>
            Booking for: {selectedMovie.name}
          </h2>
          <h2 style={{ marginLeft: "10px", marginBottom: "20px" }}>
            Price : ₹ {selectedMovie.price}
          </h2>
          <p style={{ marginLeft: "10px", marginBottom: "20px", color: "#666" }}>
            Select your seats for the movie. Available seats are shown below.
          </p>


          {bookingSeats.map((seat) => (
            <button
              key={seat}
              style={{
                margin: "5px 10px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                width: "100px",
                textAlign: "center",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: alreadyBookedSeats.includes(seat) ? "not-allowed" : "pointer",

                backgroundColor: alreadyBookedSeats.includes(seat)
                  ? "#6c757d"
                  : selectedSeats.includes(seat)
                  ? "#28a745"
                  : "#007bff",

              }}
              onClick={() => {
                if (alreadyBookedSeats.includes(seat)) {
                  alert("This seat is already booked.");
                  return;
                }
                setSelectedSeats((prev) =>
                  prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
                );
              }}
            >
              Seat {seat}
            </button>
          ))}

          <div style={{ marginTop: "20px", marginLeft: "10px" }}>
            <label style={{ fontWeight: "bold" }}>Your Name:</label>
            <input 
              type="text" 
              value={userNameInput} 
              onChange={(e) => setUserNameInput(e.target.value)}
              style={{ display: "block", width: "90%", padding: "8px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="Enter your name"
            />
          </div>

          <div style={{ marginTop: "20px", marginLeft: "10px", fontWeight: "bold", fontSize: "18px" }}>
            Total Price: 
            {!hasBookedBefore && selectedSeats.length > 0 ? (
              <>
                <span style={{ textDecoration: "line-through", color: "grey", marginRight: "10px" }}>₹ {selectedSeats.length * selectedMovie.price}</span>
                <span style={{ color: "#28a745" }}>₹ {selectedSeats.length * selectedMovie.price * 0.8} (20% First-Time Discount!)</span>
              </>
            ) : (
              <span>₹ {selectedSeats.length * selectedMovie.price}</span>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
            <button
              onClick={async () => {
                if (selectedSeats.length === 0) {
                  alert("Please select at least one seat.");
                  return;
                }
                if (!userNameInput.trim()) {
                  alert("Please enter your name.");
                  return;
                }

                try {
                  const finalPrice = hasBookedBefore 
                    ? selectedSeats.length * selectedMovie.price 
                    : selectedSeats.length * selectedMovie.price * 0.8;

                  const response = await fetch("http://localhost:5000/api/bookings", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      movieId: selectedMovie._id,
                      movieName: selectedMovie.name,
                      userName: userNameInput,
                      seats: selectedSeats,
                      totalPrice: finalPrice
                    }),
                  });

                  if (!response.ok) {
                    throw new Error("Failed to book seats");
                  }

                  alert(`Successfully booked ${selectedSeats.length} seats for ${selectedMovie.name}! Total Amount: ₹ ${finalPrice}`);
                  
                  if (!hasBookedBefore) {
                    localStorage.setItem("hasBookedBefore", "true");
                    setHasBookedBefore(true);
                  }

                  setIsModalOpen(false);
                  setSelectedSeats([]);
                  setUserNameInput("");
                  fetchAllBookings();
                } catch (err) {
                  alert("Error booking seats: " + err.message);
                }
              }}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Confirm Booking
            </button>

            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoviesList;
