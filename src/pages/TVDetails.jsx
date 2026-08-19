import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Heart,
  Play,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";

import { motion } from "framer-motion";

import { useFavorites } from "../context/FavoritesContext";

import {
  getTVDetails,
  getTVCredits,
  getTVVideos,
  getSimilarTV,
  getSeasonDetails,
} from "../services/movieApi";

import MovieRow from "../components/MovieRow";


function TVDetails() {

  const { id } = useParams();
  const navigate = useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [show, setShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [similarShows, setSimilarShows] = useState([]);

  const castRef = useRef(null);

  const [selectedSeason, setSelectedSeason] =
    useState(1);

  const [seasonData, setSeasonData] =
    useState(null);

  const [loadingEpisodes, setLoadingEpisodes] =
    useState(false);

  const [seasonOpen, setSeasonOpen] =
    useState(false);


  // =====================================================
  // FAVORITES
  // =====================================================

  const {
    addFavorite,
    removeFavorite,
    isFavorite,
  } = useFavorites();


  // =====================================================
  // LOAD SHOW
  // =====================================================

  useEffect(() => {

    async function loadShow() {

      try {

        const [
          showData,
          castData,
          videoData,
          similarData,
        ] = await Promise.all([

          getTVDetails(id),
          getTVCredits(id),
          getTVVideos(id),
          getSimilarTV(id),

        ]);


        setShow(showData);

        setCast(
          castData || []
        );


        // getTVVideos may return one video
        // or an array depending on your API function

        if (Array.isArray(videoData)) {

          setTrailers(videoData);

        } else if (videoData) {

          setTrailers([
            videoData,
          ]);

        } else {

          setTrailers([]);

        }


        setSimilarShows(
          similarData || []
        );


        if (
          showData?.seasons?.length > 0
        ) {

          const firstRealSeason =
            showData.seasons.find(
              (season) =>
                season.season_number > 0
            );


          if (firstRealSeason) {

            setSelectedSeason(
              firstRealSeason.season_number
            );

          }

        }

      } catch (error) {

        console.error(
          "Failed to load TV show:",
          error
        );

      }

    }

    loadShow();

  }, [id]);


  // =====================================================
  // LOAD EPISODES
  // =====================================================

  useEffect(() => {

    if (
      !show ||
      !selectedSeason
    ) return;


    async function loadEpisodes() {

      setLoadingEpisodes(true);

      try {

        const data =
          await getSeasonDetails(
            id,
            selectedSeason
          );

        setSeasonData(data);

      } catch (error) {

        console.error(
          "Failed to load episodes:",
          error
        );

        setSeasonData(null);

      } finally {

        setLoadingEpisodes(false);

      }

    }

    loadEpisodes();

  }, [
    id,
    selectedSeason,
    show,
  ]);


  // =====================================================
  // LOADING
  // =====================================================

  if (!show) {

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
            border-t-blue-500
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
      show.id,
      "tv"
    );


  function handleFavorite() {

    if (favorite) {

      removeFavorite(
        show.id,
        "tv"
      );

      return;

    }


    addFavorite({

      id: show.id,

      title: show.name,

      poster: show.poster_path,

      year:
        show.first_air_date?.slice(0, 4) ||
        "",

      rating:
        show.vote_average || 0,

      type: "tv",

    });

  }


  // =====================================================
  // SCROLL CAST
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
    show.backdrop_path
      ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
      : null;


  // =====================================================
  // TOTAL EPISODES
  // =====================================================

  const totalEpisodes =
    show.number_of_episodes || 0;


  // =====================================================
  // TOTAL SEASONS
  // =====================================================

  const totalSeasons =
    show.number_of_seasons || 0;


  // =====================================================
  // FIRST AIR YEAR
  // =====================================================

  const firstAirYear =
    show.first_air_date?.slice(0, 4) ||
    "N/A";


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
            alt={show.name}
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


        {/* BACK BUTTON */}

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

            {/* TV TITLE */}

            <div
              className="
                mb-6
                min-h-[90px]
              "
            >

              {show.images?.logos?.length > 0 ? (

                <img
                  src={`https://image.tmdb.org/t/p/w500${show.images.logos[0].file_path}`}
                  alt={show.name}
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
                  {show.name}
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

              {show.genres?.slice(0, 4).map(
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
                {firstAirYear}
              </span>

              <span className="text-zinc-500">
                •
              </span>

              <span>
                {totalSeasons}{" "}
                {totalSeasons === 1
                  ? "Season"
                  : "Seasons"}
              </span>

              <span className="text-zinc-500">
                •
              </span>

              <span>
                {totalEpisodes}{" "}
                {totalEpisodes === 1
                  ? "Episode"
                  : "Episodes"}
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
                  show.vote_average || 0
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

              {show.overview?.length > 400
                ? show.overview.slice(0, 400) +
                  "..."
                : show.overview}

            </p>


            {/* PRODUCTION COMPANIES */}

            {show.production_companies?.some(
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

                {show.production_companies
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
          RATINGS
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
                    show.vote_average || 0
                  ).toFixed(1)}
                </p>

              </div>

            </div>


            {/* IMDb */}

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
                  N/A
                </p>

              </div>

            </div>

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

              {trailers
                .slice(0, 4)
                .map((video) => (

                  <motion.div
                    key={video.id}
                    whileHover={{
                      y: -4,
                    }}
                    onClick={() =>
                      openTrailer(
                        video.key
                      )
                    }
                    className="
                      group
                      relative
                      aspect-video
                      w-full
                      max-w-[520px]
                      cursor-pointer
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/10
                      bg-zinc-900
                    "
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

                ))}

            </div>

          </section>

        )}


        {/* =================================================
            EPISODES
        ================================================= */}

        <section className="pb-20">

          <div
            className="
              mb-7
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
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
                Episodes
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Select a season to browse episodes
              </p>

            </div>


            {/* SEASON SELECTOR */}

            <div className="relative">

              <button
                onClick={() =>
                  setSeasonOpen(
                    !seasonOpen
                  )
                }
                className="
                  flex
                  min-w-[190px]
                  items-center
                  justify-between
                  gap-4
                  rounded-xl
                  border
                  border-white/10
                  bg-zinc-900
                  px-5
                  py-3
                  text-sm
                  font-medium
                  transition
                  hover:bg-zinc-800
                "
              >

                <span>
                  Season {selectedSeason}
                </span>

                <ChevronDown
                  size={17}
                  className={
                    seasonOpen
                      ? "rotate-180 transition"
                      : "transition"
                  }
                />

              </button>


              {seasonOpen && (

                <div
                  className="
                    absolute
                    right-0
                    top-full
                    z-50
                    mt-2
                    max-h-64
                    min-w-[190px]
                    overflow-y-auto
                    rounded-xl
                    border
                    border-white/10
                    bg-zinc-900
                    p-2
                    shadow-2xl
                  "
                >

                  {show.seasons
                    ?.filter(
                      (season) =>
                        season.season_number > 0
                    )
                    .map((season) => (

                      <button
                        key={
                          season.season_number
                        }
                        onClick={() => {

                          setSelectedSeason(
                            season.season_number
                          );

                          setSeasonOpen(false);

                        }}
                        className={`
                          w-full
                          rounded-lg
                          px-4
                          py-2.5
                          text-left
                          text-sm
                          transition
                          ${
                            selectedSeason ===
                            season.season_number
                              ? "bg-blue-600 text-white"
                              : "text-zinc-300 hover:bg-white/10"
                          }
                        `}
                      >

                        Season{" "}
                        {season.season_number}

                      </button>

                    ))}

                </div>

              )}

            </div>

          </div>


          {/* EPISODES */}

          {loadingEpisodes ? (

            <div
              className="
                flex
                min-h-[250px]
                items-center
                justify-center
              "
            >

              <div
                className="
                  h-8
                  w-8
                  animate-spin
                  rounded-full
                  border-2
                  border-white/10
                  border-t-blue-500
                "
              />

            </div>

          ) : seasonData?.episodes?.length > 0 ? (

            <div className="space-y-3">

              {seasonData.episodes.map(
                (episode) => (

                  <motion.div
                    key={episode.id}
                    whileHover={{
                      y: -2,
                    }}
                    className="
                      group
                      flex
                      cursor-pointer
                      gap-4
                      rounded-2xl
                      border
                      border-white/[0.06]
                      bg-white/[0.035]
                      p-3
                      transition
                      hover:border-blue-500/30
                      hover:bg-white/[0.06]
                      sm:p-4
                    "
                  >

                    {/* EPISODE IMAGE */}

                    <div
                      className="
                        relative
                        h-24
                        w-40
                        flex-shrink-0
                        overflow-hidden
                        rounded-xl
                        bg-zinc-900
                        sm:h-28
                        sm:w-48
                      "
                    >

                      {episode.still_path ? (

                        <img
                          src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                          alt={episode.name}
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
                          No Image
                        </div>

                      )}


                      {/* PLAY */}

                      <div
                        className="
                          absolute
                          left-1/2
                          top-1/2
                          flex
                          h-10
                          w-10
                          -translate-x-1/2
                          -translate-y-1/2
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                          text-black
                          opacity-0
                          shadow-xl
                          transition
                          group-hover:opacity-100
                        "
                      >

                        <Play
                          size={16}
                          fill="currentColor"
                        />

                      </div>

                    </div>


                    {/* EPISODE INFO */}

                    <div className="min-w-0 flex-1">

                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-2
                        "
                      >

                        <span
                          className="
                            text-xs
                            font-bold
                            text-blue-400
                          "
                        >
                          EP {episode.episode_number}
                        </span>

                        <span className="text-zinc-600">
                          •
                        </span>

                        <span
                          className="
                            text-xs
                            text-zinc-500
                          "
                        >
                          {episode.air_date ||
                            "N/A"}
                        </span>

                      </div>


                      <h3
                        className="
                          mt-2
                          truncate
                          text-base
                          font-semibold
                          sm:text-lg
                        "
                      >
                        {episode.name}
                      </h3>


                      {episode.overview && (

                        <p
                          className="
                            mt-2
                            line-clamp-2
                            text-sm
                            leading-6
                            text-zinc-500
                          "
                        >
                          {episode.overview}
                        </p>

                      )}


                      <div
                        className="
                          mt-2
                          flex
                          items-center
                          gap-3
                          text-xs
                          text-zinc-500
                        "
                      >

                        {episode.runtime && (

                          <span className="flex items-center gap-1">

                            <Clock size={13} />

                            {episode.runtime} min

                          </span>

                        )}


                        <span className="flex items-center gap-1">

                          <Star
                            size={13}
                            fill="currentColor"
                            className="text-yellow-400"
                          />

                          {Number(
                            episode.vote_average || 0
                          ).toFixed(1)}

                        </span>

                      </div>

                    </div>

                  </motion.div>

                )
              )}

            </div>

          ) : (

            <div
              className="
                rounded-2xl
                border
                border-white/[0.06]
                bg-white/[0.03]
                p-10
                text-center
                text-zinc-500
              "
            >
              No episodes available.
            </div>

          )}

        </section>

      </div>


      {/* =====================================================
          SIMILAR SHOWS
      ===================================================== */}

      {similarShows.length > 0 && (

        <section className="pb-16">

          <MovieRow
            title="You Might Also Like"
            movies={similarShows}
          />

        </section>

      )}

    </main>

  );

}

export default TVDetails;