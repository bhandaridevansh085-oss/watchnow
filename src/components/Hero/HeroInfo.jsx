import { Star } from "lucide-react";

function HeroInfo({ movie }) {
  if (!movie) return null;

  const rating = Number(movie.vote_average || 0).toFixed(1);

  const year =
    movie.release_date?.slice(0, 4) ||
    movie.first_air_date?.slice(0, 4) ||
    "";

  const overview = movie.overview || "";

  return (
    <div className="max-w-2xl">

      {/* MOVIE META */}
      <div className="flex flex-wrap items-center gap-4 text-sm sm:gap-6 sm:text-base">

        {/* Rating */}
        <div className="flex items-center gap-1.5 text-yellow-400">
          <Star
            size={17}
            fill="currentColor"
          />

          <span className="font-semibold">
            {rating}
          </span>
        </div>


        {/* Year */}
        {year && (
          <span className="text-zinc-300">
            {year}
          </span>
        )}


        {/* HD */}
        <span
          className="
            rounded
            border
            border-white/30
            px-2
            py-0.5
            text-xs
            font-medium
            text-zinc-300
          "
        >
          HD
        </span>


        {/* Movie / TV */}
        <span className="text-zinc-400">
          {movie.media_type === "tv" ||
          movie.first_air_date
            ? "TV Series"
            : "Movie"}
        </span>

      </div>


      {/* DESCRIPTION */}
      {overview && (
        <p
          className="
            mt-5
            max-w-xl
            text-sm
            leading-6
            text-zinc-300
            sm:mt-6
            sm:text-base
            sm:leading-7
          "
        >
          {overview.length > 180
            ? `${overview.slice(0, 180)}...`
            : overview}
        </p>
      )}

    </div>
  );
}

export default HeroInfo;