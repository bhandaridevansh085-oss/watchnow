import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchMulti } from "../services/movieApi";

function NavbarSearch({ search, setSearch, handleSearch }) {
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

      const data = await searchMulti(search);
      setSuggestions(data);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    function handleClick(e) {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      ref={searchRef}
      className="relative w-80"
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="flex-1 bg-transparent px-4 py-2 text-sm outline-none"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSelectedIndex((prev) =>
                prev < suggestions.length - 1 ? prev + 1 : prev
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
                if(movie.media_type === "movie"){
  navigate(`/movie/${movie.id}`);
}
else if(movie.media_type === "tv"){
  navigate(`/tv/${movie.id}`);
}
              } else {
                handleSearch();
              }
            }
          }}
        />

        <button
          onClick={handleSearch}
          className="flex w-11 items-center justify-center bg-blue-600 transition hover:bg-blue-700"
        >
          <Search size={17} />
        </button>
      </motion.div>

      {suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">
          {suggestions.map((movie, index) => (
            <button
              key={movie.id}
              onClick={() => {

  if(movie.media_type === "tv"){
    navigate(`/tv/${movie.id}`);
  }
  else{
    navigate(`/movie/${movie.id}`);
  }

  setSuggestions([]);

}}
              className={`flex w-full items-center gap-3 px-3 py-2 text-left transition ${
                selectedIndex === index
                  ? "bg-zinc-800"
                  : "hover:bg-zinc-800"
              }`}
            >
              <img
                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                className="h-12 w-8 rounded object-cover"
                alt={movie.title}
              />

              <div>
                <p className="text-sm font-semibold">
  {movie.title || movie.name}
</p>

<p className="text-xs text-zinc-400">
  {
    movie.release_date?.slice(0,4) ||
    movie.first_air_date?.slice(0,4)
  }
</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default NavbarSearch;