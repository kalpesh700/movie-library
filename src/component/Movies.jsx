import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Movies() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const searchMovie = async (e) => {
    e.preventDefault();
    if (!query) return;

    fetchMovies(query);
    setShowSuggestions(false);
  };

  const fetchMovies = async (searchTerm) => {
    try {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}`;
      const res = await fetch(url);
      const data = await res.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    if (query.length > 2) {
      const fetchSuggestions = async () => {
        try {
          const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;
          const res = await fetch(url);
          const data = await res.json();
          setSuggestions(data.results.slice(0, 5) || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error(error);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const openTrailer = (movieTitle) => {
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      movieTitle + " trailer"
    )}`;
    window.open(youtubeUrl, "_blank");
  };

  const addToWatchlist = (movie) => {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    if (!watchlist.some((m) => m.id === movie.id)) {
      watchlist.push(movie);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
      alert(`${movie.title} added to Watchlist!`);
    } else {
      alert(`${movie.title} is already in Watchlist.`);
    }
  };

  return (
    <div
      className="flex flex-col items-center min-h-screen p-6"
      style={{
        backgroundImage: "url('/1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Search Bar + Watchlist Button */}
      <div className="flex items-center gap-4 w-full max-w-md mb-6">
        <form
          onSubmit={searchMovie}
          className="relative flex items-center gap-2 bg-white rounded-2xl shadow-lg p-3 flex-1"
        >
          <svg
            className="h-[1.5em] text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>

          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Movie..."
            className="outline-none bg-transparent flex-1 text-black"
          />

          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white shadow rounded-b-lg z-10">
              {suggestions.map((movie) => (
                <li
                  key={movie.id}
                  className="p-2 hover:bg-gray-200 cursor-pointer text-black"
                  onClick={() => {
                    setQuery(movie.title);
                    fetchMovies(movie.title);
                    setShowSuggestions(false);
                  }}
                >
                  {movie.title}
                </li>
              ))}
            </ul>
          )}
        </form>

        {/* Watchlist Button */}
        <button
          type="button"
          onClick={() => navigate("/watchlist")}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-pink-600"
        >
          Watchlist
        </button>
      </div>

      {/* Movie Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Image"
                }
                alt={movie.title}
                className="w-full h-96 object-cover"
              />
              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-lg font-bold text-black">{movie.title}</h2>
                <p className="text-sm text-gray-700">
                  Release: {movie.release_date || "N/A"}
                </p>
                <p className="text-sm text-gray-800 mt-2 line-clamp-3">
                  {movie.overview || "No description available."}
                </p>

                <div className="mt-auto flex gap-2 pt-4">
                  <button
                    onClick={() => openTrailer(movie.title)}
                    className="btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Trailer
                  </button>
                  <button
                    onClick={() => addToWatchlist(movie)}
                    className="btn bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Watchlist
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white mt-10">Search for a movie above...</p>
        )}
      </div>
    </div>
  );
}

export default Movies;
