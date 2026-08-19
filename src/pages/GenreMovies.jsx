import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getMoviesByGenre, getGenres } from "../services/movieApi";
import MovieGrid from "../components/MovieGrid";

function GenreMovies() {
  const { id } = useParams();

  const [movies, setMovies] = useState([]);
  const [genreName, setGenreName] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Reset when genre changes
  useEffect(() => {
    setMovies([]);
    setPage(1);
  }, [id]);

  useEffect(() => {
    async function fetchData() {
      // Movies
      const data = await getMoviesByGenre(id, page);

      if (page === 1) {
        setMovies(data.results);
      } else {
        setMovies((prev) => [...prev, ...data.results]);
      }

      setTotalPages(data.total_pages);

      // Genre Name
      const genres = await getGenres();
      const genre = genres.find((g) => g.id === Number(id));

      if (genre) {
        setGenreName(genre.name);
      }
    }

    fetchData();
  }, [id, page]);

  return (
    <div className="pb-20">
      <MovieGrid
        title={`🎬 ${genreName} Movies`}
        movies={movies}
      />

      {page < totalPages && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-xl bg-blue-600 px-8 py-3 font-semibold transition hover:bg-blue-700"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default GenreMovies;