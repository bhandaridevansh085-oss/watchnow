import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "./ui/Button";

import {
  getSearchSuggestions,
  getFeaturedMovies,
  getMovieVideos,
} from "../services/movieApi";


function Hero({
  search,
  setSearch,
  handleSearch,
}) {

  const [suggestions, setSuggestions] =
    useState([]);

  const [selectedIndex, setSelectedIndex] =
    useState(-1);

  const [featuredMovies, setFeaturedMovies] =
    useState([]);

  const [currentMovieIndex, setCurrentMovieIndex] =
    useState(0);

  const [trailerKey, setTrailerKey] =
    useState(null);

  const navigate = useNavigate();


  /* =====================================================
     LOAD FEATURED MOVIES
  ===================================================== */

  useEffect(() => {

    async function loadFeaturedMovies() {

      try {

        const movies =
          await getFeaturedMovies();

        if (!movies || movies.length === 0) {
          return;
        }

        setFeaturedMovies(movies);

      } catch (error) {

        console.error(
          "Featured movies error:",
          error
        );

      }

    }

    loadFeaturedMovies();

  }, []);


  /* =====================================================
     FIND A MOVIE WITH A TRAILER
  ===================================================== */

  useEffect(() => {

    if (
      featuredMovies.length === 0
    ) {
      return;
    }

    let cancelled = false;

    async function findTrailer() {

      setTrailerKey(null);

      /*
        Start with the current movie.
      */

      for (
        let offset = 0;
        offset < featuredMovies.length;
        offset++
      ) {

        const index =
          (
            currentMovieIndex +
            offset
          ) %
          featuredMovies.length;

        const movie =
          featuredMovies[index];

        try {

          const videos =
            await getMovieVideos(
              movie.id
            );

          if (
            cancelled
          ) {
            return;
          }

          if (
            videos &&
            videos.length > 0
          ) {

            const trailer =
              videos.find(
                (video) =>
                  video.site ===
                    "YouTube" &&
                  video.type ===
                    "Trailer"
              ) ||
              videos.find(
                (video) =>
                  video.site ===
                    "YouTube" &&
                  video.type ===
                    "Teaser"
              );

            if (
              trailer?.key
            ) {

              /*
                If we had to skip a movie,
                update the current index.
              */

              if (
                index !==
                currentMovieIndex
              ) {

                setCurrentMovieIndex(
                  index
                );

              }

              setTrailerKey(
                trailer.key
              );

              return;
            }

          }

        } catch (error) {

          console.error(
            "Trailer search error:",
            error
          );

        }

      }

      /*
        None of the featured movies
        had a usable trailer.
      */

      setTrailerKey(null);

    }

    findTrailer();

    return () => {
      cancelled = true;
    };

  }, [
    featuredMovies,
    currentMovieIndex,
  ]);


  /* =====================================================
     AUTO CHANGE HERO
  ===================================================== */

  useEffect(() => {

    if (
      featuredMovies.length <= 1
    ) {
      return;
    }

    const timer =
      setInterval(() => {

        setCurrentMovieIndex(
          (previous) =>
            (
              previous + 1
            ) %
            featuredMovies.length
        );

      }, 30000);

    return () =>
      clearInterval(timer);

  }, [
    featuredMovies.length,
  ]);


  /* =====================================================
     SEARCH SUGGESTIONS
  ===================================================== */

  useEffect(() => {

    const timer =
      setTimeout(async () => {

        if (
          !search.trim()
        ) {

          setSuggestions([]);

          setSelectedIndex(-1);

          return;
        }

        try {

          const data =
            await getSearchSuggestions(
              search
            );

          setSuggestions(
            data || []
          );

          setSelectedIndex(-1);

        } catch (error) {

          console.error(
            error
          );

          setSuggestions([]);

        }

      }, 300);

    return () =>
      clearTimeout(timer);

  }, [
    search,
  ]);


  /* =====================================================
     CURRENT MOVIE
  ===================================================== */

  const currentMovie =
    featuredMovies[
      currentMovieIndex
    ];


  /* =====================================================
     BACKDROP
  ===================================================== */

  const backdropUrl =
    currentMovie?.backdrop_path
      ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`
      : null;


  return (

    <section
      className="
        relative
        flex
        min-h-[90vh]
        items-center
        overflow-hidden
      "
    >

      {/* =================================================
         FALLBACK BACKDROP
      ================================================= */}

      {backdropUrl && (

        <motion.img
          key={backdropUrl}
          initial={{
            opacity: 0,
            scale: 1.05,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1,
          }}
          src={backdropUrl}
          alt=""
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
          "
        />

      )}


      {/* =================================================
         TRAILER
      ================================================= */}

      {trailerKey && (

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            overflow-hidden
          "
        >

          <iframe
            key={trailerKey}
            src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3`}
            title="Movie Trailer"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            className="
              absolute
              left-1/2
              top-1/2
              h-[56.25vw]
              min-h-full
              min-w-full
              -translate-x-1/2
              -translate-y-1/2
              scale-[1.35]
              border-0
            "
          />

        </div>

      )}


      {/* =================================================
         DARK OVERLAY
      ================================================= */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-[#09090B]
          via-[#09090B]/85
          to-[#09090B]/30
        "
      />


      {/* =================================================
         BOTTOM FADE
      ================================================= */}

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-72
          bg-gradient-to-t
          from-[#09090B]
          via-[#09090B]/70
          to-transparent
        "
      />


      {/* =================================================
         TOP FADE
      ================================================= */}

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-40
          bg-gradient-to-b
          from-black/50
          to-transparent
        "
      />


      {/* =================================================
         BLUE GLOW
      ================================================= */}

      <div
        className="
          absolute
          -left-44
          -top-44
          h-[700px]
          w-[700px]
          rounded-full
          bg-blue-600/20
          blur-[180px]
        "
      />

      <div
        className="
          absolute
          -bottom-44
          -right-44
          h-[700px]
          w-[700px]
          rounded-full
          bg-cyan-500/10
          blur-[180px]
        "
      />


      {/* =================================================
         CONTENT
      ================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 70,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-7xl
          px-8
        "
      >

        <div
          className="
            max-w-4xl
          "
        >

          {/* =================================================
             BADGE
          ================================================= */}

          <motion.span
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.2,
            }}
            className="
              inline-flex
              rounded-full
              border
              border-blue-500/30
              bg-blue-500/10
              px-5
              py-2
              font-medium
              text-blue-300
              backdrop-blur-sm
            "
          >
            AI Powered Movie Discovery
          </motion.span>


          {/* =================================================
             TITLE
          ================================================= */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
            }}
            className="
              mt-8
              text-7xl
              font-black
              leading-tight
            "
          >

            Discover Your
            <br />

            Next Favorite

            <span className="text-blue-500">
              {" "}Movie.
            </span>

          </motion.h1>


          {/* =================================================
             DESCRIPTION
          ================================================= */}

          <motion.p
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.45,
            }}
            className="
              mt-8
              max-w-2xl
              text-xl
              leading-9
              text-zinc-400
            "
          >
            Search millions of movies, explore hidden gems,
            create your watchlist and enjoy an intelligent
            movie discovery experience.
          </motion.p>


          {/* =================================================
             SEARCH
          ================================================= */}

          <div
            className="
              relative
              mt-10
            "
          >

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.6,
              }}
              className="
                flex
                overflow-hidden
                rounded-2xl
                border
                border-zinc-700
                bg-zinc-900/90
                backdrop-blur-xl
              "
            >

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {

                  if (
                    e.key ===
                    "ArrowDown"
                  ) {

                    e.preventDefault();

                    setSelectedIndex(
                      (prev) =>
                        prev <
                        suggestions.length - 1
                          ? prev + 1
                          : prev
                    );

                  }


                  if (
                    e.key ===
                    "ArrowUp"
                  ) {

                    e.preventDefault();

                    setSelectedIndex(
                      (prev) =>
                        prev > 0
                          ? prev - 1
                          : 0
                    );

                  }


                  if (
                    e.key ===
                    "Enter"
                  ) {

                    if (
                      selectedIndex >= 0 &&
                      suggestions[
                        selectedIndex
                      ]
                    ) {

                      navigate(
                        `/movie/${suggestions[selectedIndex].id}`
                      );

                      setSuggestions([]);

                    } else {

                      handleSearch();

                    }

                  }

                }}
                placeholder="Search movies..."
                className="
                  flex-1
                  bg-transparent
                  px-6
                  py-4
                  text-lg
                  outline-none
                "
              />


              <button
                onClick={
                  handleSearch
                }
                className="
                  flex
                  items-center
                  gap-2
                  bg-blue-600
                  px-8
                  font-semibold
                  transition-all
                  duration-300
                  hover:bg-blue-700
                  hover:px-10
                "
              >

                <Search size={20} />

                Search

              </button>

            </motion.div>


            {/* =================================================
               SUGGESTIONS
            ================================================= */}

            {suggestions.length > 0 && (

              <div
                className="
                  absolute
                  left-0
                  right-0
                  top-full
                  z-[99999]
                  mt-2
                  overflow-hidden
                  rounded-xl
                  border
                  border-zinc-700
                  bg-zinc-900
                  shadow-2xl
                "
              >

                {suggestions.map(
                  (movie, index) => (

                    <button
                      key={movie.id}
                      onClick={() => {

                        navigate(
                          `/movie/${movie.id}`
                        );

                        setSuggestions([]);

                      }}
                      className={`
                        flex
                        w-full
                        items-center
                        gap-4
                        border-b
                        border-zinc-800
                        px-5
                        py-3
                        text-left
                        transition
                        ${
                          selectedIndex ===
                          index
                            ? "bg-zinc-800"
                            : "hover:bg-zinc-800"
                        }
                      `}
                    >

                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                            : "https://via.placeholder.com/92x138?text=No+Image"
                        }
                        alt={
                          movie.title
                        }
                        className="
                          h-14
                          w-10
                          rounded
                          object-cover
                        "
                      />


                      <div>

                        <p className="font-semibold">
                          {movie.title}
                        </p>

                        <p className="text-sm text-zinc-400">
                          {movie.release_date?.slice(
                            0,
                            4
                          )}
                        </p>

                      </div>

                    </button>

                  )
                )}

              </div>

            )}

          </div>


          {/* =================================================
             BUTTONS
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.8,
            }}
            className="
              mt-10
              flex
              gap-4
            "
          >

            <Link to="/movies">

              <Button
                className="
                  min-w-[190px]
                "
              >
                Explore Movies
              </Button>

            </Link>


            <Link to="/favorites">

              <Button
                variant="secondary"
                className="
                  min-w-[190px]
                "
              >
                My Favorites
              </Button>

            </Link>

          </motion.div>

        </div>

      </motion.div>

    </section>

  );

}

export default Hero;