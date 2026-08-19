import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef } from "react";

import MovieCard from "./MovieCard";

function MovieRow({ title, movies }) {
  const sliderRef = useRef(null);

  if (!movies || movies.length === 0) {
    return null;
  }

  function scrollLeft() {
    sliderRef.current?.scrollBy({
      left: -700,
      behavior: "smooth",
    });
  }

  function scrollRight() {
    sliderRef.current?.scrollBy({
      left: 700,
      behavior: "smooth",
    });
  }

  return (
    <section className="relative w-full py-7 sm:py-8">

      {/* HEADER */}

      <div className="
        mb-5
        flex
        items-center
        px-5
        sm:px-7
        lg:px-10
      ">
        <h2 className="
          text-xl
          font-semibold
          tracking-tight
          text-white
          sm:text-2xl
        ">
          {title}
        </h2>
      </div>


      {/* MOVIE SLIDER */}

      <div className="relative">

        <div
          ref={sliderRef}
          className="
            flex
            gap-4
            overflow-x-auto
            scroll-smooth
            px-5
            pb-3
            scrollbar-hide
            sm:gap-5
            sm:px-7
            lg:gap-5
            lg:px-10
          "
        >

          {movies.map((movie, index) => (
            <motion.div
              key={`${movie.movieId || movie.id}-${movie.type || movie.media_type || ""}`}
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.3,
                delay:
                  Math.min(index, 8) * 0.025,
              }}
            >
              <MovieCard
                id={
                  movie.movieId ||
                  movie.id
                }

                title={movie.title}

                name={movie.name}

                poster_path={
                  movie.poster_path ||
                  movie.poster
                }

                release_date={
                  movie.release_date ||
                  movie.year
                }

                first_air_date={
                  movie.first_air_date ||
                  movie.year
                }

                rating={
                  movie.vote_average ||
                  movie.rating ||
                  0
                }

                mediaType={
                  movie.media_type ||
                  movie.type ||
                  (
                    movie.title
                      ? "movie"
                      : "tv"
                  )
                }
              />
            </motion.div>
          ))}

        </div>


        {/* LEFT ARROW */}

        <button
          onClick={scrollLeft}
          aria-label="Previous movies"
          className="
            absolute
            left-3
            top-1/2
            z-30
            flex
            h-11
            w-11
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/15
            bg-black/55
            text-white
            backdrop-blur-md
            transition-all
            duration-300
            hover:scale-105
            hover:bg-black/80
          "
        >
          <ChevronLeft size={21} />
        </button>


        {/* RIGHT ARROW */}

        <button
          onClick={scrollRight}
          aria-label="Next movies"
          className="
            absolute
            right-3
            top-1/2
            z-30
            flex
            h-11
            w-11
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/15
            bg-black/55
            text-white
            backdrop-blur-md
            transition-all
            duration-300
            hover:scale-105
            hover:bg-black/80
          "
        >
          <ChevronRight size={21} />
        </button>

      </div>

    </section>
  );
}

export default MovieRow;