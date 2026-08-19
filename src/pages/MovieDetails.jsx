import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  Play,
  Star,
  ExternalLink,
} from "lucide-react";

import { motion } from "framer-motion";

import { useFavorites } from "../context/FavoritesContext";

import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getMovieLogo,
  getSimilarMovies,
  getMovieCollection,
  getExternalRatings,
} from "../services/movieApi";

import MovieRow from "../components/MovieRow";


function MovieDetails() {

  const { id } = useParams();
  const navigate = useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [movieLogo, setMovieLogo] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [collection, setCollection] = useState(null);

  const castRef = useRef(null);
  const collectionRef = useRef(null);

  const [externalRatings, setExternalRatings] = useState({
    imdb: null,
    rottenTomatoes: null,
  });


  // =====================================================
  // FAVORITES
  // =====================================================

  const {
    addFavorite,
    removeFavorite,
    isFavorite,
  } = useFavorites();


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    async function loadMovie() {

      try {

        const [
          movieData,
          castData,
          videoData,
          logoData,
          similarData,
          ratingsData,
        ] = await Promise.all([

          getMovieDetails(id),
          getMovieCredits(id),
          getMovieVideos(id),
          getMovieLogo(id),
          getSimilarMovies(id),
          getExternalRatings(id),

        ]);


        setMovie(movieData);

        setCast(castData || []);

        setTrailers(videoData || []);

        setMovieLogo(logoData);

        setSimilarMovies(
          similarData || []
        );


        setExternalRatings({

          imdb:
            ratingsData?.imdb || null,

          rottenTomatoes:
            ratingsData?.rottenTomatoes ||
            null,

        });


        // =================================================
        // COLLECTION
        // =================================================

        if (
          movieData.belongs_to_collection?.id
        ) {

          const collectionData =
            await getMovieCollection(
              movieData.belongs_to_collection.id
            );

          setCollection(
            collectionData
          );

        }

      } catch (error) {

        console.error(
          "Failed to load movie:",
          error
        );

      }

    }

    loadMovie();

  }, [id]);


  // =====================================================
  // LOADING
  // =====================================================

  if (!movie) {

    return (

      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#050505]
        "
      >

        <div
          className="
            h-9
            w-9
            animate-spin
            rounded-full
            border-2
            border-white/10
            border-t-white
          "
        />

      </main>

    );

  }


  // =====================================================
  // FAVORITE
  // =====================================================

  const favorite =
    isFavorite(
      movie.id,
      "movie"
    );


  function handleFavorite() {

    if (favorite) {

      removeFavorite(
        movie.id,
        "movie"
      );

      return;

    }


    addFavorite({

      id: movie.id,

      title: movie.title,

      poster: movie.poster_path,

      year:
        movie.release_date?.slice(0, 4) ||
        "",

      rating:
        movie.vote_average || 0,

      type: "movie",

    });

  }


  // =====================================================
  // SCROLL CAST / COLLECTION
  // =====================================================

  function scrollRow(
    ref,
    direction
  ) {

    if (!ref.current) return;

    ref.current.scrollBy({

      left:
        direction * 500,

      behavior:
        "smooth",

    });

  }


  // =====================================================
  // TRAILER
  // =====================================================

  function openTrailer(key) {

    window.open(
      `https://www.youtube.com/watch?v=${key}`,
      "_blank"
    );

  }


  // =====================================================
  // BACKDROP
  // =====================================================

  const backdropUrl =
    movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : null;


  // =====================================================
  // RUNTIME
  // =====================================================

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${
        movie.runtime % 60
      }m`
    : "N/A";


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <main
      className="
        relative
        min-h-screen
        overflow-x-hidden
        bg-[#050505]
        text-white
      "
    >

      {/* =================================================
          GLOBAL BACKGROUND
      ================================================= */}

      {backdropUrl && (

        <div
          className="
            pointer-events-none
            fixed
            inset-0
            -z-20
          "
        >

          <img
            src={backdropUrl}
            alt=""
            className="
              h-full
              w-full
              scale-105
              object-cover
              opacity-20
              blur-[3px]
            "
          />

        </div>

      )}


      <div
        className="
          pointer-events-none
          fixed
          inset-0
          -z-10
          bg-gradient-to-b
          from-black/60
          via-[#050505]/80
          to-[#050505]
        "
      />


      {/* =================================================
          HERO
      ================================================= */}

      <section
        className="
          relative
          min-h-[720px]
          overflow-hidden
        "
      >

        {/* BACKDROP */}

        {backdropUrl && (

          <motion.img
            initial={{
              opacity: 0,
              scale: 1.06,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1,
            }}
            src={backdropUrl}
            alt={movie.title}
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
          />

        )}


        {/* LEFT GRADIENT */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/95
            via-black/65
            to-transparent
          "
        />


        {/* BOTTOM GRADIENT */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-[65%]
            bg-gradient-to-t
            from-[#050505]
            via-[#050505]/70
            to-transparent
          "
        />


        {/* TOP GRADIENT */}

        <div
          className="
            absolute
            inset-x-0
            top-0
            h-40
            bg-gradient-to-b
            from-black/80
            to-transparent
          "
        />


        {/* BACK */}

        <button
          onClick={() => navigate(-1)}
          className="
            absolute
            left-6
            top-24
            z-30
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            bg-black/40
            backdrop-blur-xl
            transition
            hover:bg-white/15
            sm:left-8
          "
        >

          <ArrowLeft size={21} />

        </button>


        {/* HERO CONTENT */}

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
            duration: 0.7,
          }}
          className="
            relative
            z-20
            mx-auto
            flex
            min-h-[720px]
            max-w-[1500px]
            items-end
            px-6
            pb-16
            sm:px-8
            lg:px-10
          "
        >

          <div
            className="
              w-full
              max-w-6xl
            "
          >

            {/* LOGO */}

            <div
              className="
                mb-6
                min-h-[90px]
              "
            >

              {movieLogo ? (

                <img
                  src={`https://image.tmdb.org/t/p/w500${movieLogo}`}
                  alt={movie.title}
                  className="
                    max-h-32
                    max-w-[430px]
                    object-contain
                    object-left
                    drop-shadow-2xl
                  "
                />

              ) : (

                <h1
                  className="
                    text-5xl
                    font-black
                    sm:text-6xl
                  "
                >
                  {movie.title}
                </h1>

              )}

            </div>


            {/* GENRES */}

            <div
              className="
                flex
                flex-wrap
                gap-3
                text-sm
                text-zinc-200
              "
            >

              {movie.genres?.slice(0, 4).map(
                (genre, index) => (

                  <div
                    key={genre.id}
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    {index > 0 && (
                      <span className="text-zinc-500">
                        •
                      </span>
                    )}

                    {genre.name}

                  </div>

                )
              )}

            </div>


            {/* ACTIONS */}

            <div
              className="
                mt-6
                flex
                items-center
                gap-3
              "
            >

              {trailers.length > 0 && (

                <button
                  onClick={() =>
                    openTrailer(
                      trailers[0].key
                    )
                  }
                  className="
                    flex
                    h-12
                    items-center
                    gap-2
                    rounded-full
                    bg-white
                    px-7
                    font-semibold
                    text-black
                    transition
                    hover:scale-105
                    hover:bg-zinc-200
                  "
                >

                  <Play
                    size={18}
                    fill="currentColor"
                  />

                  Play

                </button>

              )}


              <button
                onClick={handleFavorite}
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/15
                  bg-white/10
                  backdrop-blur-xl
                  transition
                  hover:scale-105
                  hover:bg-white/20
                "
              >

                <Heart
                  size={20}
                  fill={
                    favorite
                      ? "currentColor"
                      : "none"
                  }
                  className={
                    favorite
                      ? "text-red-500"
                      : "text-white"
                  }
                />

              </button>

            </div>


            {/* META */}

            <div
              className="
                mt-6
                flex
                flex-wrap
                items-center
                gap-4
                text-sm
                text-zinc-200
              "
            >

              <span>
                {movie.release_date?.slice(0, 4)}
              </span>

              <span className="text-zinc-500">
                •
              </span>

              <span>
                {runtime}
              </span>

              <span className="text-zinc-500">
                •
              </span>

              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  text-yellow-400
                "
              >

                <Star
                  size={16}
                  fill="currentColor"
                />

                {Number(
                  movie.vote_average || 0
                ).toFixed(1)}

              </div>

            </div>


            {/* DESCRIPTION */}

            <p
              className="
                mt-5
                max-w-2xl
                text-sm
                leading-7
                text-zinc-300
                sm:text-base
              "
            >

              {movie.overview?.length > 400
                ? movie.overview.slice(0, 400) +
                  "..."
                : movie.overview}

            </p>


            {/* PRODUCTION COMPANY LOGOS */}

            {movie.production_companies?.some(
              (company) =>
                company.logo_path
            ) && (

              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  items-center
                  gap-6
                "
              >

                {movie.production_companies
                  .filter(
                    (company) =>
                      company.logo_path
                  )
                  .slice(0, 4)
                  .map((company) => (

                    <div
                      key={company.id}
                      className="
                        flex
                        h-10
                        max-w-[130px]
                        items-center
                        justify-center
                        opacity-70
                      "
                    >

                      <img
                        src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                        alt={company.name}
                        className="
                          max-h-9
                          max-w-[120px]
                          object-contain
                          brightness-0
                          invert
                        "
                      />

                    </div>

                  ))}

              </div>

            )}

          </div>

        </motion.div>

      </section>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-6
          sm:px-8
          lg:px-10
        "
      >

        {/* =================================================
            RATINGS
        ================================================= */}

        <section className="pb-12">

          <div
            className="
              flex
              flex-wrap
              gap-4
            "
          >

            {/* TMDB */}

            <div
              className="
                flex
                min-w-[150px]
                items-center
                gap-3
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.04]
                px-5
                py-3
              "
            >

              <Star
                size={20}
                fill="currentColor"
                className="text-yellow-400"
              />

              <div>

                <p className="text-xs text-zinc-500">
                  TMDB
                </p>

                <p className="font-bold">
                  {Number(
                    movie.vote_average || 0
                  ).toFixed(1)}
                </p>

              </div>

            </div>


            {/* IMDb */}

            {externalRatings.imdb && (

              <div
                className="
                  flex
                  min-w-[150px]
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-white/[0.04]
                  px-5
                  py-3
                "
              >

                <span
                  className="
                    rounded
                    bg-yellow-400
                    px-1.5
                    py-0.5
                    text-xs
                    font-black
                    text-black
                  "
                >
                  IMDb
                </span>

                <div>

                  <p className="text-xs text-zinc-500">
                    IMDb
                  </p>

                  <p className="font-bold">
                    {externalRatings.imdb}
                  </p>

                </div>

              </div>

            )}


            {/* ROTTEN TOMATOES */}

            {externalRatings.rottenTomatoes && (

              <div
                className="
                  flex
                  min-w-[180px]
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-white/[0.04]
                  px-5
                  py-3
                "
              >

                <span className="text-xl">
                  🍅
                </span>

                <div>

                  <p className="text-xs text-zinc-500">
                    Rotten Tomatoes
                  </p>

                  <p className="font-bold">
                    {externalRatings.rottenTomatoes}
                  </p>

                </div>

              </div>

            )}

          </div>

        </section>


        {/* =================================================
            CAST
        ================================================= */}

        {cast.length > 0 && (

          <section className="pb-16">

            <div
              className="
                mb-7
                flex
                items-center
                justify-between
              "
            >

              <h2
                className="
                  text-2xl
                  font-bold
                  sm:text-3xl
                "
              >
                Cast
              </h2>


              <div className="flex gap-2">

                <button
                  onClick={() =>
                    scrollRow(
                      castRef,
                      -1
                    )
                  }
                  aria-label="Previous cast members"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.06]
                    text-white
                    backdrop-blur-xl
                    transition
                    hover:bg-white/15
                  "
                >

                  <ChevronLeft size={20} />

                </button>


                <button
                  onClick={() =>
                    scrollRow(
                      castRef,
                      1
                    )
                  }
                  aria-label="Next cast members"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.06]
                    text-white
                    backdrop-blur-xl
                    transition
                    hover:bg-white/15
                  "
                >

                  <ChevronRight size={20} />

                </button>

              </div>

            </div>


            <div
              ref={castRef}
              className="
                flex
                gap-6
                overflow-x-auto
                pb-4
                scrollbar-hide
              "
            >

              {cast.slice(0, 12).map(
                (actor) => (

                  <motion.div
                    key={actor.id}
                    whileHover={{
                      y: -6,
                    }}
                    onClick={() =>
                      navigate(
                        `/person/${actor.id}`
                      )
                    }
                    className="
                      w-28
                      flex-shrink-0
                      cursor-pointer
                      sm:w-32
                    "
                  >

                    <div
                      className="
                        aspect-square
                        overflow-hidden
                        rounded-full
                        border
                        border-white/10
                        bg-zinc-900
                      "
                    >

                      {actor.profile_path ? (

                        <img
                          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                          alt={actor.name}
                          loading="lazy"
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                        />

                      ) : (

                        <div
                          className="
                            flex
                            h-full
                            items-center
                            justify-center
                            text-xs
                            text-zinc-600
                          "
                        >
                          N/A
                        </div>

                      )}

                    </div>


                    <h3
                      className="
                        mt-3
                        truncate
                        text-sm
                        font-semibold
                      "
                    >
                      {actor.name}
                    </h3>


                    <p
                      className="
                        mt-1
                        truncate
                        text-xs
                        text-zinc-500
                      "
                    >
                      {actor.character}
                    </p>

                  </motion.div>

                )
              )}

            </div>

          </section>

        )}


        {/* =================================================
            TRAILERS
        ================================================= */}

        {trailers.length > 0 && (

          <section className="pb-20">

            <div className="mb-7">

              <h2
                className="
                  text-2xl
                  font-bold
                  sm:text-3xl
                "
              >
                Trailers
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Trailers and teasers
              </p>

            </div>


            <div
              className="
                grid
                max-w-4xl
                gap-5
                md:grid-cols-2
              "
            >

              {trailers.slice(0, 4).map(
                (video) => (

                  <motion.div
                    key={video.id}
                    whileHover={{
                      y: -4,
                    }}
                    className="
                      group
                      relative
                      aspect-video
                      cursor-pointer
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/10
                      bg-zinc-900
                    "
                    onClick={() =>
                      openTrailer(
                        video.key
                      )
                    }
                  >

                    <img
                      src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                      alt={video.name}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition
                        duration-700
                        group-hover:scale-105
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/90
                        via-black/10
                        to-black/20
                      "
                    />


                    <div
                      className="
                        absolute
                        left-1/2
                        top-1/2
                        flex
                        h-16
                        w-16
                        -translate-x-1/2
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-black
                        shadow-2xl
                        transition
                        group-hover:scale-110
                      "
                    >

                      <Play
                        size={24}
                        fill="currentColor"
                      />

                    </div>


                    <div
                      className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        p-5
                      "
                    >

                      <p
                        className="
                          text-xs
                          uppercase
                          tracking-wider
                          text-zinc-400
                        "
                      >
                        {video.type}
                      </p>

                      <h3
                        className="
                          mt-1
                          line-clamp-1
                          font-semibold
                        "
                      >
                        {video.name}
                      </h3>

                    </div>

                  </motion.div>

                )
              )}

            </div>

          </section>

        )}

      </div>


      {/* =====================================================
          COLLECTION
      ===================================================== */}

      {collection?.parts?.length > 0 && (

        <section className="pb-20">

          <div
            className="
              mx-auto
              max-w-[1500px]
              px-6
              sm:px-8
              lg:px-10
            "
          >

            <div
              className="
                mb-7
                flex
                items-center
                justify-between
              "
            >

              <div>

                <h2
                  className="
                    text-2xl
                    font-bold
                    sm:text-3xl
                  "
                >
                  {collection.name}
                </h2>

                <p className="mt-2 text-sm text-zinc-500">
                  Part of this collection
                </p>

              </div>


              <div className="flex gap-2">

                <button
                  onClick={() =>
                    scrollRow(
                      collectionRef,
                      -1
                    )
                  }
                  aria-label="Previous collection movies"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.06]
                    text-white
                    backdrop-blur-xl
                    transition
                    hover:bg-white/15
                  "
                >

                  <ChevronLeft size={20} />

                </button>


                <button
                  onClick={() =>
                    scrollRow(
                      collectionRef,
                      1
                    )
                  }
                  aria-label="Next collection movies"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.06]
                    text-white
                    backdrop-blur-xl
                    transition
                    hover:bg-white/15
                  "
                >

                  <ChevronRight size={20} />

                </button>

              </div>

            </div>

          </div>


          <div
            ref={collectionRef}
            className="
              mx-auto
              flex
              max-w-[1500px]
              gap-5
              overflow-x-auto
              px-6
              pb-5
              scrollbar-hide
              sm:px-8
              lg:px-10
            "
          >

            {collection.parts
              .filter(
                (item) =>
                  item.poster_path
              )
              .sort(
                (a, b) =>
                  new Date(
                    a.release_date || 0
                  ) -
                  new Date(
                    b.release_date || 0
                  )
              )
              .map((item) => (

                <motion.div
                  key={item.id}
                  whileHover={{
                    y: -7,
                  }}
                  onClick={() =>
                    navigate(
                      `/movie/${item.id}`
                    )
                  }
                  className="
                    group
                    w-[170px]
                    flex-shrink-0
                    cursor-pointer
                    sm:w-[190px]
                    lg:w-[205px]
                  "
                >

                  <div
                    className="
                      relative
                      aspect-[2/3]
                      overflow-hidden
                      rounded-2xl
                      bg-zinc-900
                    "
                  >

                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={item.title}
                      loading="lazy"
                      className="
                        h-full
                        w-full
                        object-cover
                        transition
                        duration-500
                        group-hover:scale-105
                      "
                    />


                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/80
                        via-transparent
                        to-transparent
                        opacity-0
                        transition
                        group-hover:opacity-100
                      "
                    />


                    <div
                      className="
                        absolute
                        left-1/2
                        top-1/2
                        flex
                        h-12
                        w-12
                        -translate-x-1/2
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-black
                        opacity-0
                        transition
                        group-hover:opacity-100
                      "
                    >

                      <Play
                        size={19}
                        fill="currentColor"
                      />

                    </div>


                    <div
                      className="
                        absolute
                        left-3
                        top-3
                        flex
                        items-center
                        gap-1
                        rounded-full
                        bg-black/70
                        px-2
                        py-1
                        text-xs
                        backdrop-blur
                      "
                    >

                      <Star
                        size={12}
                        fill="currentColor"
                        className="text-yellow-400"
                      />

                      {Number(
                        item.vote_average || 0
                      ).toFixed(1)}

                    </div>

                  </div>


                  <h3
                    className="
                      mt-3
                      truncate
                      text-sm
                      font-semibold
                    "
                  >
                    {item.title}
                  </h3>


                  <p
                    className="
                      mt-1
                      text-xs
                      text-zinc-500
                    "
                  >
                    {item.release_date?.slice(0, 4) ||
                      "N/A"}
                  </p>

                </motion.div>

              ))}

          </div>

        </section>

      )}


      {/* =====================================================
          SIMILAR
      ===================================================== */}

      {similarMovies.length > 0 && (

        <section className="pb-16">

          <MovieRow
            title="You Might Also Like"
            movies={similarMovies}
          />

        </section>

      )}

    </main>

  );

}

export default MovieDetails;