import React, { useEffect, useState } from "react";

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingSeats, setBookingSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

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

  const bookSelect = (movieId) => {
    const movie = movies.find((m) => m._id === movieId);
    setSelectedMovie(movie);
    setIsModalOpen(true);
    initializeSeats();
  };

  const initializeSeats = () => {
    if (bookingSeats.length === 0) {
      setBookingSeats(Array.from({ length: 30 }, (_, index) => index + 1));
    }
  };



  return (
    <>
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
                cursor: "pointer",

                backgroundColor: selectedSeats.includes(seat)
                  ? "#28a745"
                  : "#007bff",

              }}
              onClick={() => { setSelectedSeats((prev) => [...prev, seat]) }}
            >
              Seat {seat}
            </button>
          ))}

          <button
            onClick={() => setIsModalOpen(false)}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              display: "block",
              textAlign: "center",
              margin: "20px auto",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}

export default MoviesList;
