import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedWatchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    setWatchlist(storedWatchlist);
  }, []);

  const removeFromWatchlist = (id) => {
    const updatedList = watchlist.filter((movie) => movie.id !== id);
    setWatchlist(updatedList);
    localStorage.setItem("watchlist", JSON.stringify(updatedList));
  };

  return (
    <>
      {/* Watchlist Navigation Button */}
      <button
        onClick={() => navigate("/")}
        className="btn bg-red-500 text-white px-4 py-2 rounded mb-4 hover:bg-pink-600"
      >
        Back
      </button>

      {/* Watchlist Content with Background */}
      <div
        className="p-6 min-h-screen"
        style={{
          backgroundImage: "url('/1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-2xl font-bold mb-4 text-white">My Watchlist</h1>

        {/* No movies message */}
        {watchlist.length === 0 ? (
<p className="text-center text-4xl font-extrabold text-red-600 drop-shadow-lg mt-20 border-4 border-white rounded-lg p-4">
  Oops! No movies in Watchlist 🎬
</p>

        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {watchlist.map((movie) => (
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
                  <h2 className="text-lg font-bold">{movie.title}</h2>
                  <p className="text-sm text-gray-700">
                    Release: {movie.release_date || "N/A"}
                  </p>
                  <p className="text-sm text-gray-800 mt-2 line-clamp-3">
                    {movie.overview || "No description available."}
                  </p>
                  <button
                    onClick={() => removeFromWatchlist(movie.id)}
                    className="btn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Watchlist;
