import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Heart,
  Film,
  Tv,
  Play,
} from "lucide-react";

import { motion } from "framer-motion";

import { useFavorites } from "../context/FavoritesContext";
import MovieCard from "../components/MovieCard";

function Favorites() {
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const [filter, setFilter] = useState("all");

  // =====================================================
  // FILTER FAVORITES
  // =====================================================

  const movies = favorites.filter(
    (item) => item.type === "movie"
  );

  const shows = favorites.filter(
    (item) => item.type === "tv"
  );

  const filteredFavorites =
    filter === "movies"
      ? movies
      : filter === "shows"
        ? shows
        : favorites;

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (favorites.length === 0) {
    return (
      <main
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-[#050505]
          text-white
        "
      >
        {/* BACKGROUND */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-[500px]
            w-[800px]
            -translate-x-1/2
            rounded-full
            bg-red-500/[0.06]
            blur-[150px]
          "
        />

        {/* CONTENT */}

        <div
          className="
            relative
            mx-auto
            flex
            min-h-screen
            max-w-4xl
            flex-col
            items-center
            justify-center
            px-6
            pb-20
            pt-28
            text-center
          "
        >
          {/* ICON */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="
              flex
              h-24
              w-24
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-white/[0.04]
              text-red-400
            "
          >
            <Heart
              size={42}
              fill="currentColor"
            />
          </motion.div>

          {/* TITLE */}

          <h1
            className="
              mt-8
              text-4xl
              font-black
              tracking-tight
              sm:text-5xl
            "
          >
            Your List is Empty
          </h1>

          {/* DESCRIPTION */}

          <p
            className="
              mt-4
              max-w-lg
              text-base
              leading-7
              text-zinc-400
            "
          >
            Save movies and TV shows you want
            to watch later. They'll appear here
            in your personal collection.
          </p>

          {/* BUTTON */}

          <button
            onClick={() => navigate("/movies")}
            className="
              mt-8
              flex
              items-center
              gap-2
              rounded-full
              bg-white
              px-7
              py-3
              font-semibold
              text-black
              transition
              hover:bg-zinc-200
            "
          >
            <Play size={18} fill="currentColor" />
            Browse Movies
          </button>
        </div>
      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main
      className="
        min-h-screen
        bg-[#050505]
        px-6
        pb-20
        pt-32
        text-white
      "
    >
      <div
        className="
          mx-auto
          max-w-[1500px]
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            flex-col
            gap-6
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <h1
              className="
                text-4xl
                font-black
                tracking-tight
                sm:text-5xl
              "
            >
              My List
            </h1>

            <p
              className="
                mt-2
                text-zinc-400
              "
            >
              Movies and shows you've saved
            </p>
          </div>

          {/* =================================================
              FILTER BUTTONS
          ================================================= */}

          <div
            className="
              flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-white/10
              bg-white/[0.03]
              p-1
            "
          >
            {/* ALL */}

            <button
              onClick={() => setFilter("all")}
              className={`
                rounded-full
                px-5
                py-2
                text-sm
                font-medium
                transition-all
                ${
                  filter === "all"
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:text-white"
                }
              `}
            >
              All
            </button>

            {/* MOVIES */}

            <button
              onClick={() => setFilter("movies")}
              className={`
                rounded-full
                px-5
                py-2
                text-sm
                font-medium
                transition-all
                ${
                  filter === "movies"
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:text-white"
                }
              `}
            >
              Movies
            </button>

            {/* SHOWS */}

            <button
              onClick={() => setFilter("shows")}
              className={`
                rounded-full
                px-5
                py-2
                text-sm
                font-medium
                transition-all
                ${
                  filter === "shows"
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:text-white"
                }
              `}
            >
              Shows
            </button>
          </div>
        </div>

        {/* =================================================
            COUNT
        ================================================= */}

        <div
          className="
            mt-10
            flex
            items-center
            gap-2
            text-sm
            text-zinc-500
          "
        >
          <Heart
            size={16}
            fill="currentColor"
          />

          {filteredFavorites.length}{" "}
          {filteredFavorites.length === 1
            ? "item"
            : "items"}
        </div>

        {/* =================================================
            NO MOVIES FOR FILTER
        ================================================= */}

        {filteredFavorites.length === 0 ? (
          <div
            className="
              flex
              min-h-[400px]
              flex-col
              items-center
              justify-center
              text-center
            "
          >
            {filter === "movies" ? (
              <Film
                size={48}
                className="text-zinc-600"
              />
            ) : (
              <Tv
                size={48}
                className="text-zinc-600"
              />
            )}

            <h2
              className="
                mt-5
                text-2xl
                font-bold
              "
            >
              {filter === "movies"
                ? "No Movies Saved"
                : "No Shows Saved"}
            </h2>

            <p
              className="
                mt-2
                text-zinc-500
              "
            >
              Add something to your list
              and it will appear here.
            </p>
          </div>
        ) : (
          /* =================================================
             FAVORITES GRID
          ================================================= */

          <div
            className="
              mt-8
              grid
              grid-cols-2
              gap-x-4
              gap-y-8
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              xl:grid-cols-6
            "
          >
            {filteredFavorites.map(
              (item, index) => (
                <motion.div
                  key={`${item.type}-${item.movieId}`}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.03,
                  }}
                  className="
                    flex
                    justify-center
                  "
                >
                  <MovieCard
                    id={item.movieId}
                    title={item.title}
                    name={item.name}
                    poster={item.poster}
                    year={item.year}
                    rating={item.rating}
                    mediaType={item.type}
                  />
                </motion.div>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default Favorites;