import MovieCard from "./MovieCard";
import SectionTitle from "./ui/SectionTitle";

function MovieGrid({ title, movies }) {
  return (
    <section className="mx-auto max-w-7xl px-8 py-14">
      <SectionTitle>{title}</SectionTitle>

      <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            year={movie.release_date?.slice(0, 4) || movie.year}
            poster={movie.poster_path || movie.poster}
            rating={movie.vote_average ?? movie.rating}
          />
        ))}
      </div>
    </section>
  );
}

export default MovieGrid;