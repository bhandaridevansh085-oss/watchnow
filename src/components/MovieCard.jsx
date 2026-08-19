import { useNavigate } from "react-router-dom";

import {
  Star,
  Play,
  Heart,
} from "lucide-react";

import { motion } from "framer-motion";

import {
  useFavorites,
} from "../context/FavoritesContext";


function MovieCard({
  id,
  movieId,

  title,
  name,

  year,
  release_date,
  first_air_date,

  poster,
  poster_path,

  rating = 0,
  vote_average,

  mediaType,
}) {

  const navigate =
    useNavigate();


  const {
    addFavorite,
    removeFavorite,
    isFavorite,
  } = useFavorites();


  // =====================================================
  // DATA
  // =====================================================

  const actualId =
    id ?? movieId;


  const mediaTitle =
    title ||
    name ||
    "Untitled";


  const mediaYear =
    year ||
    release_date?.slice(0, 4) ||
    first_air_date?.slice(0, 4);


  const mediaPoster =
    poster ||
    poster_path;


  const mediaRating =
    Number(
      rating ??
      vote_average ??
      0
    );


  const actualMediaType =
    mediaType ||
    (
      name && !title
        ? "tv"
        : "movie"
    );


  // =====================================================
  // FAVORITE
  // =====================================================

  const favorite =
    isFavorite(
      actualId,
      actualMediaType
    );


  // =====================================================
  // CARD CLICK
  // =====================================================

  function handleCardClick() {

    if (!actualId) {
      return;
    }


    if (
      actualMediaType === "tv"
    ) {

      navigate(
        `/tv/${actualId}`
      );

    } else {

      navigate(
        `/movie/${actualId}`
      );

    }

  }


  // =====================================================
  // FAVORITE CLICK
  // =====================================================

  function handleFavoriteClick(
    event
  ) {

    event.stopPropagation();


    if (!actualId) {

      console.error(
        "MovieCard has no ID:",
        {
          id,
          movieId,
          mediaTitle,
        }
      );

      return;

    }


    if (favorite) {

      removeFavorite(
        actualId,
        actualMediaType
      );

    } else {

      addFavorite({

        id:
          actualId,

        title:
          mediaTitle,

        poster:
          mediaPoster,

        year:
          mediaYear,

        rating:
          mediaRating,

        type:
          actualMediaType,

      });

    }

  }


  // =====================================================
  // CARD
  // =====================================================

  return (

    <motion.div

      whileHover={{
        y: -5,
      }}

      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}

      onClick={
        handleCardClick
      }

      className="
        group
        w-[185px]
        flex-shrink-0
        cursor-pointer
        sm:w-[195px]
        md:w-[205px]
        lg:w-[215px]
      "
    >

      {/* =================================================
          POSTER
      ================================================= */}

      <div
        className="
          relative
          aspect-[2/3]
          overflow-hidden
          rounded-[14px]
          bg-zinc-900
          shadow-lg
        "
      >

        <img

          src={

            mediaPoster

              ? `https://image.tmdb.org/t/p/w500${mediaPoster}`

              : "/placeholder-poster.jpg"

          }

          alt={
            mediaTitle
          }

          loading="lazy"

          onError={(
            event
          ) => {

            event.currentTarget.src =
              "/placeholder-poster.jpg";

          }}

          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            ease-out
            group-hover:scale-[1.04]
          "
        />


        {/* =================================================
            HOVER OVERLAY
        ================================================= */}

        <div
          className="
            absolute
            inset-0
            bg-black/0
            transition-all
            duration-300
            group-hover:bg-black/45
          "
        />


        {/* =================================================
            BOTTOM GRADIENT
        ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-[55%]
            bg-gradient-to-t
            from-black/95
            via-black/45
            to-transparent
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
        />


        {/* =================================================
            RATING
        ================================================= */}

        <div
          className="
            absolute
            left-2.5
            top-2.5
            flex
            items-center
            gap-1
            rounded-full
            bg-black/65
            px-2.5
            py-1
            text-xs
            font-medium
            text-white
            backdrop-blur-md
          "
        >

          <Star
            size={11}
            fill="currentColor"
            className="text-yellow-400"
          />

          <span>
            {mediaRating.toFixed(1)}
          </span>

        </div>


        {/* =================================================
            FAVORITE
        ================================================= */}

        <button

          onClick={
            handleFavoriteClick
          }

          aria-label={
            favorite
              ? "Remove from favorites"
              : "Add to favorites"
          }

          className="
            absolute
            right-2.5
            top-2.5
            z-20
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-black/60
            text-white
            opacity-0
            backdrop-blur-md
            transition-all
            duration-200
            hover:scale-110
            group-hover:opacity-100
          "
        >

          <Heart

            size={15}

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


        {/* =================================================
            PLAY
        ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            flex
            items-center
            justify-center
          "
        >

          <motion.div

            initial={{
              scale: 0.8,
              opacity: 0,
            }}

            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-white
              text-black
              shadow-2xl
              opacity-0
              transition-all
              duration-300
              group-hover:scale-100
              group-hover:opacity-100
            "
          >

            <Play
              size={21}
              fill="currentColor"
              className="ml-0.5"
            />

          </motion.div>

        </div>


        {/* =================================================
            INFORMATION
        ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-3
            left-3
            right-3
            translate-y-2
            opacity-0
            transition-all
            duration-300
            group-hover:translate-y-0
            group-hover:opacity-100
          "
        >

          <h2
            className="
              line-clamp-2
              text-sm
              font-semibold
              leading-tight
              text-white
            "
          >
            {mediaTitle}
          </h2>


          {mediaYear && (

            <p
              className="
                mt-1
                text-xs
                text-white/65
              "
            >
              {mediaYear}
            </p>

          )}

        </div>

      </div>

    </motion.div>

  );

}


export default MovieCard;