import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSearchSuggestions } from "../services/movieApi";

function SearchBar({
  search,
  setSearch,
  handleSearch,
  className = "",
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!search.trim()) {
        setSuggestions([]);
        return;
      }

      const data = await getSearchSuggestions(search);
      setSuggestions(data);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setSuggestions([]);
        setSelectedIndex(-1);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div
      ref={searchRef}
      className={`relative ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search movies..."
          className="flex-1 bg-transparent px-6 py-4 text-lg outline-none"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSelectedIndex((prev) =>
                prev < suggestions.length - 1
                  ? prev + 1
                  : prev
              );
            }

            if (e.key === "ArrowUp") {
              e.preventDefault();
              setSelectedIndex((prev) =>
                prev > 0 ? prev - 1 : 0
              );
            }

            if (e.key === "Enter") {
              if (selectedIndex >= 0) {
                navigate(
                  `/movie/${suggestions[selectedIndex].id}`
                );
                setSuggestions([]);
              } else {
                handleSearch();
              }
            }
          }}
        />

        <button
          onClick={handleSearch}
          className="flex items-center gap-2 bg-blue-600 px-8 font-semibold transition-all duration-300 hover:bg-blue-700 hover:px-10"
        >
          <Search size={20} />
          Search
        </button>
      </motion.div>

      {suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-[99999] mt-2 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">
          {suggestions.map((movie, index) => (
            <button
              key={movie.id}
              onClick={() => {
                navigate(`/movie/${movie.id}`);
                setSuggestions([]);
              }}
              className={`flex w-full items-center gap-4 border-b border-zinc-800 px-5 py-3 text-left transition ${
                selectedIndex === index
                  ? "bg-zinc-800"
                  : "hover:bg-zinc-800"
              }`}
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                    : "https://via.placeholder.com/92x138?text=No+Image"
                }
                alt={movie.title}
                className="h-14 w-10 rounded object-cover"
              />

              <div>
                <p className="font-semibold">
                  {movie.title}
                </p>

                <p className="text-sm text-zinc-400">
                  {movie.release_date?.slice(0, 4)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;