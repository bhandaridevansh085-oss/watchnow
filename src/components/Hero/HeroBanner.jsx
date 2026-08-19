import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";

import HeroInfo from "./HeroInfo";
import HeroButtons from "./HeroButtons";

import {
  getFeaturedMovies,
  getMovieVideos,
  getMovieLogo,
} from "../../services/movieApi";

function HeroBanner() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [trailer, setTrailer] = useState(null);
  const [logo, setLogo] = useState(null);

  const [loading, setLoading] = useState(true);
  const [assetsLoading, setAssetsLoading] = useState(false);

  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const playerRef = useRef(null);

  const movie = movies[currentIndex];


  /* =====================================================
     LOAD FEATURED MOVIES
  ===================================================== */

  useEffect(() => {
    async function loadFeaturedMovies() {
      try {
        setLoading(true);

        const data = await getFeaturedMovies();

        setMovies(data || []);
      } catch (error) {
        console.error(
          "Failed to load featured movies:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedMovies();
  }, []);


  /* =====================================================
     LOAD TRAILER + LOGO
  ===================================================== */

  useEffect(() => {
    if (!movie) return;

    let cancelled = false;

    async function loadMovieAssets() {
      setAssetsLoading(true);

      // Remove previous movie's trailer/logo
      setTrailer(null);
      setLogo(null);

      // Every new trailer starts muted
      setIsMuted(true);

      try {
        const [trailerData, logoData] =
          await Promise.all([
            getMovieVideos(movie.id),
            getMovieLogo(movie.id),
          ]);

        if (cancelled) return;

        setTrailer(
          trailerData?.key || null
        );

        setLogo(
          logoData || null
        );
      } catch (error) {
        console.error(
          "Failed to load hero assets:",
          error
        );
      } finally {
        if (!cancelled) {
          setAssetsLoading(false);
        }
      }
    }

    loadMovieAssets();

    return () => {
      cancelled = true;
    };
  }, [movie]);


  /* =====================================================
     AUTOPLAY

     Movie changes every 30 seconds
  ===================================================== */

  useEffect(() => {
    if (
      movies.length <= 1 ||
      isPaused ||
      assetsLoading
    ) {
      return;
    }

    const timer = setTimeout(() => {
      setCurrentIndex(
        (previous) =>
          (previous + 1) % movies.length
      );
    }, 30000);

    return () => clearTimeout(timer);
  }, [
    currentIndex,
    movies.length,
    isPaused,
    assetsLoading,
  ]);


  /* =====================================================
     PREVIOUS MOVIE
  ===================================================== */

  function previousMovie() {
    if (!movies.length) return;

    setCurrentIndex(
      (previous) =>
        (previous - 1 + movies.length) %
        movies.length
    );
  }


  /* =====================================================
     NEXT MOVIE
  ===================================================== */

  function nextMovie() {
    if (!movies.length) return;

    setCurrentIndex(
      (previous) =>
        (previous + 1) % movies.length
    );
  }


  /* =====================================================
     MUTE / UNMUTE
  ===================================================== */

  function toggleMute() {
    const iframe = playerRef.current;

    if (!iframe) return;

    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: isMuted
          ? "unMute"
          : "mute",
        args: [],
      }),
      "*"
    );

    setIsMuted(!isMuted);
  }


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading || !movie) {
    return (
      <section className="relative h-screen min-h-[650px] w-full overflow-hidden bg-[#050505]">

        <div className="absolute inset-0 animate-pulse bg-zinc-950" />

        <div className="absolute bottom-28 left-5 sm:left-10 lg:left-16">

          <div className="h-20 w-80 rounded-lg bg-white/10" />

          <div className="mt-5 h-4 w-80 rounded bg-white/5" />

          <div className="mt-6 h-11 w-32 rounded-full bg-white/10" />

        </div>

      </section>
    );
  }


  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="
        relative
        h-screen
        min-h-[650px]
        w-full
        overflow-hidden
        bg-black
      "
    >

      {/* =================================================
          TRAILER / BACKDROP
      ================================================= */}

      <AnimatePresence mode="wait">

        {trailer ? (

          <motion.iframe
            key={`trailer-${movie.id}`}
            ref={playerRef}

            initial={{
              opacity: 0,
              scale: 1.03,
            }}

            animate={{
              opacity: 1,
              scale: 1,
            }}

            exit={{
              opacity: 0,
            }}

            transition={{
              duration: 1.2,
              ease: "easeInOut",
            }}

            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[120%]
              w-[120%]
              -translate-x-1/2
              -translate-y-1/2
              scale-[1.15]
            "

            src={`https://www.youtube.com/embed/${trailer}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`}

            title={
              movie.title ||
              movie.name
            }

            allow="autoplay; encrypted-media"
          />

        ) : (

          <motion.img
            key={`backdrop-${movie.id}`}

            initial={{
              opacity: 0,
              scale: 1.03,
            }}

            animate={{
              opacity: 1,
              scale: 1,
            }}

            exit={{
              opacity: 0,
            }}

            transition={{
              duration: 1.2,
              ease: "easeInOut",
            }}

            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}

            alt={
              movie.title ||
              movie.name
            }

            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
          />

        )}

      </AnimatePresence>


      {/* =================================================
          BRIGHT CINEMATIC OVERLAYS
      ================================================= */}

      {/* Very subtle overall tint */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-black/5
        "
      />


      {/* Left side readability */}
      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          left-0
          w-[55%]
          bg-gradient-to-r
          from-black/55
          via-black/20
          to-transparent
        "
      />


      {/* Bottom readability */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-[45%]
          bg-gradient-to-t
          from-[#050505]
          via-[#050505]/35
          to-transparent
        "
      />


      {/* Very subtle top fade */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-32
          bg-gradient-to-b
          from-black/30
          to-transparent
        "
      />


      {/* =================================================
          CONTENT
      ================================================= */}

      <motion.div
        key={`content-${movie.id}`}

        initial={{
          opacity: 0,
          x: -25,
        }}

        animate={{
          opacity: 1,
          x: 0,
        }}

        transition={{
          duration: 0.8,
        }}

        className="
          relative
          z-10
          flex
          h-full
          w-full
          items-end
        "
      >

        <div
          className="
            w-full
            px-5
            pb-24
            sm:px-8
            sm:pb-28
            lg:px-12
            xl:px-16
          "
        >

          <div className="max-w-2xl">

            {/* =================================================
                MOVIE LOGO
            ================================================= */}

            {logo && (

              <motion.img
                key={logo}

                initial={{
                  opacity: 0,
                  y: 12,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  duration: 0.7,
                }}

                src={`https://image.tmdb.org/t/p/original${logo}`}

                alt={
                  movie.title ||
                  movie.name
                }

                className="
                  mb-5
                  max-h-28
                  max-w-[380px]
                  object-contain
                  object-left
                  drop-shadow-2xl
                  sm:max-h-36
                  sm:max-w-[480px]
                "
              />

            )}


            {/* =================================================
                MOVIE INFORMATION
            ================================================= */}

            <HeroInfo movie={movie} />


            {/* =================================================
                BUTTONS
            ================================================= */}

            <HeroButtons movie={movie} />

          </div>

        </div>

      </motion.div>


      {/* =================================================
          MUTE BUTTON
      ================================================= */}

      {trailer && (

        <button
          onClick={toggleMute}
          aria-label={
            isMuted
              ? "Unmute trailer"
              : "Mute trailer"
          }

          className="
            absolute
            bottom-10
            right-[125px]
            z-40
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            bg-white/[0.07]
            text-white/80
            shadow-lg
            backdrop-blur-xl
            transition-all
            duration-300
            hover:bg-white/[0.15]
            hover:text-white
            sm:right-[135px]
            lg:right-[140px]
          "
        >

          {isMuted ? (
            <VolumeX size={18} />
          ) : (
            <Volume2 size={18} />
          )}

        </button>

      )}


      {/* =================================================
          PREVIOUS / NEXT BUTTONS
      ================================================= */}

      {movies.length > 1 && (

        <div
          className="
            absolute
            bottom-10
            right-5
            z-30
            flex
            items-center
            gap-2
            sm:right-8
            lg:right-12
          "
        >

          <button
            onClick={previousMovie}
            aria-label="Previous movie"

            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-white/[0.07]
              text-white/80
              backdrop-blur-xl
              transition
              hover:bg-white/[0.15]
              hover:text-white
            "
          >

            <ChevronLeft size={19} />

          </button>


          <button
            onClick={nextMovie}
            aria-label="Next movie"

            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-white/[0.07]
              text-white/80
              backdrop-blur-xl
              transition
              hover:bg-white/[0.15]
              hover:text-white
            "
          >

            <ChevronRight size={19} />

          </button>

        </div>

      )}


      {/* =================================================
          DOTS
      ================================================= */}

      {movies.length > 1 && (

        <div
          className="
            absolute
            bottom-14
            left-1/2
            z-30
            flex
            -translate-x-1/2
            items-center
            gap-2
          "
        >

          {movies.map((_, index) => (

            <button
              key={index}
              onClick={() =>
                setCurrentIndex(index)
              }

              className="
                flex
                h-3
                items-center
              "

              aria-label={`Go to slide ${index + 1}`}
            >

              <motion.span
                animate={{
                  width:
                    currentIndex === index
                      ? 24
                      : 6,

                  opacity:
                    currentIndex === index
                      ? 1
                      : 0.3,
                }}

                transition={{
                  duration: 0.3,
                }}

                className="
                  block
                  h-1.5
                  rounded-full
                  bg-white
                "
              />

            </button>

          ))}

        </div>

      )}


      {/* =================================================
          FINAL BOTTOM FADE
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          h-24
          bg-gradient-to-t
          from-[#050505]
          to-transparent
        "
      />

    </section>
  );
}

export default HeroBanner;