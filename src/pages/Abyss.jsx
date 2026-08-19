import { useState } from "react";
import {
  Search,
  Sparkles,
  X,
} from "lucide-react";

import MovieCard from "../components/MovieCard";

import {
  searchMulti,
} from "../services/movieApi";

import {
  generateAbyssRecommendations,
} from "../services/abyssEngine";


function Abyss() {

  // =====================================================
  // SEARCH
  // =====================================================

  const [firstQuery, setFirstQuery] =
    useState("");

  const [secondQuery, setSecondQuery] =
    useState("");


  const [firstResults, setFirstResults] =
    useState([]);

  const [secondResults, setSecondResults] =
    useState([]);


  // =====================================================
  // SELECTED TITLES
  // =====================================================

  const [firstMovie, setFirstMovie] =
    useState(null);

  const [secondMovie, setSecondMovie] =
    useState(null);


  // =====================================================
  // LOADING
  // =====================================================

  const [loadingFirst, setLoadingFirst] =
    useState(false);

  const [loadingSecond, setLoadingSecond] =
    useState(false);

  const [loadingAbyss, setLoadingAbyss] =
    useState(false);


  // =====================================================
  // RESULTS
  // =====================================================

  const [recommendations, setRecommendations] =
    useState([]);

  const [error, setError] =
    useState("");


  // =====================================================
  // SEARCH FIRST TITLE
  // =====================================================

  async function searchFirst(value) {

    setFirstQuery(value);

    setFirstMovie(null);

    setRecommendations([]);

    setError("");


    if (!value.trim()) {

      setFirstResults([]);

      return;

    }


    setLoadingFirst(true);


    try {

      const results =
        await searchMulti(value);


      setFirstResults(
        Array.isArray(results)
          ? results.slice(0, 8)
          : []
      );


    } catch (err) {

      console.error(
        "ABYSS first search failed:",
        err
      );

      setFirstResults([]);

    } finally {

      setLoadingFirst(false);

    }

  }


  // =====================================================
  // SEARCH SECOND TITLE
  // =====================================================

  async function searchSecond(value) {

    setSecondQuery(value);

    setSecondMovie(null);

    setRecommendations([]);

    setError("");


    if (!value.trim()) {

      setSecondResults([]);

      return;

    }


    setLoadingSecond(true);


    try {

      const results =
        await searchMulti(value);


      setSecondResults(
        Array.isArray(results)
          ? results.slice(0, 8)
          : []
      );


    } catch (err) {

      console.error(
        "ABYSS second search failed:",
        err
      );

      setSecondResults([]);

    } finally {

      setLoadingSecond(false);

    }

  }


  // =====================================================
  // SELECT FIRST
  // =====================================================

  function selectFirst(item) {

    const type =
      item.media_type === "tv"
        ? "tv"
        : "movie";


    setFirstMovie({

      ...item,

      type,

    });


    setFirstQuery(
      item.title ||
      item.name ||
      ""
    );


    setFirstResults([]);

    setRecommendations([]);

    setError("");

  }


  // =====================================================
  // SELECT SECOND
  // =====================================================

  function selectSecond(item) {

    const type =
      item.media_type === "tv"
        ? "tv"
        : "movie";


    setSecondMovie({

      ...item,

      type,

    });


    setSecondQuery(
      item.title ||
      item.name ||
      ""
    );


    setSecondResults([]);

    setRecommendations([]);

    setError("");

  }


  // =====================================================
  // CLEAR FIRST
  // =====================================================

  function clearFirst() {

    setFirstMovie(null);

    setFirstQuery("");

    setFirstResults([]);

    setRecommendations([]);

    setError("");

  }


  // =====================================================
  // CLEAR SECOND
  // =====================================================

  function clearSecond() {

    setSecondMovie(null);

    setSecondQuery("");

    setSecondResults([]);

    setRecommendations([]);

    setError("");

  }


  // =====================================================
  // RUN ABYSS
  // =====================================================

  async function runAbyss() {

    setError("");


    // -----------------------------------------------------
    // CHECK FIRST
    // -----------------------------------------------------

    if (!firstMovie) {

      setError(
        "Choose your first movie or TV show."
      );

      return;

    }


    // -----------------------------------------------------
    // CHECK SECOND
    // -----------------------------------------------------

    if (!secondMovie) {

      setError(
        "Choose your second movie or TV show."
      );

      return;

    }


    // -----------------------------------------------------
    // SAME TITLE
    // -----------------------------------------------------

    if (
      firstMovie.id === secondMovie.id &&
      firstMovie.type === secondMovie.type
    ) {

      setError(
        "Choose two different titles."
      );

      return;

    }


    // -----------------------------------------------------
    // START
    // -----------------------------------------------------

    setLoadingAbyss(true);

    setRecommendations([]);


    try {

      console.log(
        "🌌 Starting ABYSS..."
      );

      console.log(
        "First:",
        firstMovie
      );

      console.log(
        "Second:",
        secondMovie
      );


      // =================================================
      // NEW ABYSS ENGINE
      // =================================================

      const results =
        await generateAbyssRecommendations(
          firstMovie,
          secondMovie
        );


      console.log(
        "🌌 ABYSS results:",
        results
      );


      // =================================================
      // NO RESULTS
      // =================================================

      if (
        !Array.isArray(results) ||
        results.length === 0
      ) {

        setError(
          "ABYSS couldn't find similar content. Try two different titles."
        );

        return;

      }


      // =================================================
      // RESULTS
      // =================================================

      setRecommendations(
        results.slice(0, 40)
      );


    } catch (err) {

      console.error(
        "🌌 ABYSS failed:",
        err
      );


      setError(
        "ABYSS couldn't find recommendations. Please try again."
      );


    } finally {

      setLoadingAbyss(false);

    }

  }


  // =====================================================
  // TITLE HELPER
  // =====================================================

  function getTitle(item) {

    return (
      item?.title ||
      item?.name ||
      "Unknown"
    );

  }


  // =====================================================
  // YEAR HELPER
  // =====================================================

  function getYear(item) {

    const date =
      item?.release_date ||
      item?.first_air_date ||
      "";


    return date
      ? date.slice(0, 4)
      : "";

  }


  // =====================================================
  // TYPE HELPER
  // =====================================================

  function getType(item) {

    return item?.type === "tv"
      ? "TV Show"
      : "Movie";

  }


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <main
      className="
        min-h-screen
        bg-[#050505]
        px-6
        pb-24
        pt-32
        text-white
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
        "
      >


        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            mx-auto
            max-w-3xl
            text-center
          "
        >

          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              border
              border-blue-500/20
              bg-blue-500/10
              shadow-lg
              shadow-blue-500/10
            "
          >

            <Sparkles
              size={30}
              className="text-blue-400"
            />

          </div>


          <h1
            className="
              mt-7
              text-5xl
              font-black
              tracking-tight
              md:text-6xl
            "
          >
            ABYSS
          </h1>


          <p
            className="
              mt-5
              text-lg
              leading-8
              text-zinc-400
            "
          >
            Choose two movies or TV shows
            and discover what connects them.
          </p>

        </div>


        {/* =================================================
            SELECTION AREA
        ================================================= */}

        <div
          className="
            mx-auto
            mt-14
            grid
            max-w-6xl
            gap-8
            md:grid-cols-2
          "
        >


          {/* =================================================
              FIRST SELECTION
          ================================================= */}

          <div
            className="
              relative
              rounded-3xl
              border
              border-zinc-800
              bg-zinc-950
              p-6
              shadow-2xl
            "
          >

            <div className="mb-6">

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-blue-400
                "
              >
                Selection 01
              </p>


              <h2
                className="
                  mt-2
                  text-2xl
                  font-bold
                "
              >
                Choose your first
              </h2>

            </div>


            {/* SEARCH */}

            <div className="relative">

              <div
                className="
                  flex
                  items-center
                  rounded-2xl
                  border
                  border-zinc-700
                  bg-zinc-900
                  px-4
                  transition
                  focus-within:border-blue-500/50
                "
              >

                <Search
                  size={19}
                  className="flex-shrink-0 text-zinc-500"
                />


                <input
                  value={firstQuery}
                  onChange={(event) =>
                    searchFirst(
                      event.target.value
                    )
                  }
                  placeholder="Search movies or TV shows..."
                  className="
                    w-full
                    bg-transparent
                    px-4
                    py-4
                    text-white
                    outline-none
                    placeholder:text-zinc-600
                  "
                />


                {firstMovie && (

                  <button
                    onClick={clearFirst}
                    className="
                      flex-shrink-0
                      text-zinc-500
                      transition
                      hover:text-white
                    "
                  >

                    <X size={18} />

                  </button>

                )}

              </div>


              {/* SEARCH DROPDOWN */}

              {firstResults.length > 0 && (

                <div
                  className="
                    absolute
                    left-0
                    right-0
                    top-full
                    z-50
                    mt-2
                    overflow-hidden
                    rounded-2xl
                    border
                    border-zinc-700
                    bg-zinc-950
                    shadow-2xl
                  "
                >

                  {firstResults.map(
                    (item) => (

                      <button
                        key={`first-${item.media_type}-${item.id}`}
                        onClick={() =>
                          selectFirst(item)
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-4
                          border-b
                          border-zinc-800
                          p-3
                          text-left
                          transition
                          last:border-0
                          hover:bg-zinc-900
                        "
                      >

                        <img
                          src={
                            item.poster_path
                              ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                              : "https://via.placeholder.com/92x138?text=No+Image"
                          }
                          alt=""
                          className="
                            h-16
                            w-11
                            flex-shrink-0
                            rounded-lg
                            object-cover
                          "
                        />


                        <div className="min-w-0">

                          <p
                            className="
                              truncate
                              font-semibold
                            "
                          >
                            {getTitle(item)}
                          </p>


                          <p
                            className="
                              mt-1
                              text-sm
                              text-zinc-500
                            "
                          >
                            {item.media_type === "tv"
                              ? "TV Show"
                              : "Movie"}

                            {" • "}

                            {getYear(item)}

                          </p>

                        </div>

                      </button>

                    )
                  )}

                </div>

              )}

            </div>


            {/* SELECTED FIRST */}

            {firstMovie && (

              <div
                className="
                  mt-6
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-zinc-800
                  bg-zinc-900/50
                  p-4
                "
              >

                <img
                  src={
                    firstMovie.poster_path
                      ? `https://image.tmdb.org/t/p/w185${firstMovie.poster_path}`
                      : "https://via.placeholder.com/185x278?text=No+Image"
                  }
                  alt=""
                  className="
                    h-28
                    w-20
                    flex-shrink-0
                    rounded-xl
                    object-cover
                  "
                />


                <div className="min-w-0">

                  <p
                    className="
                      truncate
                      text-lg
                      font-bold
                    "
                  >
                    {getTitle(firstMovie)}
                  </p>


                  <p
                    className="
                      mt-1
                      text-sm
                      text-blue-400
                    "
                  >
                    {getType(firstMovie)}

                    {getYear(firstMovie) &&
                      ` • ${getYear(firstMovie)}`}
                  </p>

                </div>

              </div>

            )}


            {loadingFirst && (

              <p
                className="
                  mt-3
                  text-sm
                  text-zinc-500
                "
              >
                Searching...
              </p>

            )}

          </div>


          {/* =================================================
              SECOND SELECTION
          ================================================= */}

          <div
            className="
              relative
              rounded-3xl
              border
              border-zinc-800
              bg-zinc-950
              p-6
              shadow-2xl
            "
          >

            <div className="mb-6">

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-purple-400
                "
              >
                Selection 02
              </p>


              <h2
                className="
                  mt-2
                  text-2xl
                  font-bold
                "
              >
                Choose your second
              </h2>

            </div>


            {/* SEARCH */}

            <div className="relative">

              <div
                className="
                  flex
                  items-center
                  rounded-2xl
                  border
                  border-zinc-700
                  bg-zinc-900
                  px-4
                  transition
                  focus-within:border-purple-500/50
                "
              >

                <Search
                  size={19}
                  className="flex-shrink-0 text-zinc-500"
                />


                <input
                  value={secondQuery}
                  onChange={(event) =>
                    searchSecond(
                      event.target.value
                    )
                  }
                  placeholder="Search movies or TV shows..."
                  className="
                    w-full
                    bg-transparent
                    px-4
                    py-4
                    text-white
                    outline-none
                    placeholder:text-zinc-600
                  "
                />


                {secondMovie && (

                  <button
                    onClick={clearSecond}
                    className="
                      flex-shrink-0
                      text-zinc-500
                      transition
                      hover:text-white
                    "
                  >

                    <X size={18} />

                  </button>

                )}

              </div>


              {/* SEARCH DROPDOWN */}

              {secondResults.length > 0 && (

                <div
                  className="
                    absolute
                    left-0
                    right-0
                    top-full
                    z-50
                    mt-2
                    overflow-hidden
                    rounded-2xl
                    border
                    border-zinc-700
                    bg-zinc-950
                    shadow-2xl
                  "
                >

                  {secondResults.map(
                    (item) => (

                      <button
                        key={`second-${item.media_type}-${item.id}`}
                        onClick={() =>
                          selectSecond(item)
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-4
                          border-b
                          border-zinc-800
                          p-3
                          text-left
                          transition
                          last:border-0
                          hover:bg-zinc-900
                        "
                      >

                        <img
                          src={
                            item.poster_path
                              ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                              : "https://via.placeholder.com/92x138?text=No+Image"
                          }
                          alt=""
                          className="
                            h-16
                            w-11
                            flex-shrink-0
                            rounded-lg
                            object-cover
                          "
                        />


                        <div className="min-w-0">

                          <p
                            className="
                              truncate
                              font-semibold
                            "
                          >
                            {getTitle(item)}
                          </p>


                          <p
                            className="
                              mt-1
                              text-sm
                              text-zinc-500
                            "
                          >

                            {item.media_type === "tv"
                              ? "TV Show"
                              : "Movie"}

                            {" • "}

                            {getYear(item)}

                          </p>

                        </div>

                      </button>

                    )
                  )}

                </div>

              )}

            </div>


            {/* SELECTED SECOND */}

            {secondMovie && (

              <div
                className="
                  mt-6
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-zinc-800
                  bg-zinc-900/50
                  p-4
                "
              >

                <img
                  src={
                    secondMovie.poster_path
                      ? `https://image.tmdb.org/t/p/w185${secondMovie.poster_path}`
                      : "https://via.placeholder.com/185x278?text=No+Image"
                  }
                  alt=""
                  className="
                    h-28
                    w-20
                    flex-shrink-0
                    rounded-xl
                    object-cover
                  "
                />


                <div className="min-w-0">

                  <p
                    className="
                      truncate
                      text-lg
                      font-bold
                    "
                  >
                    {getTitle(secondMovie)}
                  </p>


                  <p
                    className="
                      mt-1
                      text-sm
                      text-purple-400
                    "
                  >
                    {getType(secondMovie)}

                    {getYear(secondMovie) &&
                      ` • ${getYear(secondMovie)}`}
                  </p>

                </div>

              </div>

            )}


            {loadingSecond && (

              <p
                className="
                  mt-3
                  text-sm
                  text-zinc-500
                "
              >
                Searching...
              </p>

            )}

          </div>

        </div>


        {/* =================================================
            ABYSS BUTTON
        ================================================= */}

        <div
          className="
            mt-10
            flex
            justify-center
          "
        >

          <button
            onClick={runAbyss}
            disabled={
              !firstMovie ||
              !secondMovie ||
              loadingAbyss
            }
            className="
              flex
              min-w-[230px]
              items-center
              justify-center
              gap-3
              rounded-2xl
              bg-blue-600
              px-8
              py-4
              text-lg
              font-bold
              shadow-xl
              shadow-blue-600/20
              transition
              hover:bg-blue-500
              hover:shadow-blue-500/30
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >

            <Sparkles size={21} />

            {loadingAbyss
              ? "ABYSS is searching..."
              : "Enter ABYSS"}

          </button>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div
            className="
              mx-auto
              mt-5
              max-w-xl
              rounded-xl
              border
              border-red-500/20
              bg-red-500/5
              px-5
              py-3
              text-center
              text-sm
              text-red-400
            "
          >

            {error}

          </div>

        )}


        {/* =================================================
            RESULTS
        ================================================= */}

        {recommendations.length > 0 && (

          <section className="mt-20">


            {/* RESULTS HEADER */}

            <div
              className="
                mb-10
                text-center
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-3
                "
              >

                <Sparkles
                  size={24}
                  className="text-blue-400"
                />


                <h2
                  className="
                    text-3xl
                    font-black
                  "
                >
                  ABYSS Results
                </h2>

              </div>


              <p
                className="
                  mt-3
                  text-zinc-500
                "
              >

                Finding the connection between{" "}

                <span className="text-zinc-300">
                  {getTitle(firstMovie)}
                </span>

                {" + "}

                <span className="text-zinc-300">
                  {getTitle(secondMovie)}
                </span>

              </p>

            </div>


            {/* =================================================
                RESULT GRID
            ================================================= */}

            <div
              className="
                grid
                grid-cols-2
                gap-6
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-5
                xl:grid-cols-6
              "
            >

              {recommendations.map(
                (item) => (

                  <MovieCard
                    key={
                      `${item.type}-${item.id}`
                    }

                    id={item.id}

                    title={
                      item.title ||
                      item.name ||
                      "Untitled"
                    }

                    name={
                      item.name
                    }

                    poster={
                      item.poster_path
                    }

                    year={
                      item.release_date
                        ? item.release_date.slice(
                            0,
                            4
                          )
                        : item.first_air_date
                          ? item.first_air_date.slice(
                              0,
                              4
                            )
                          : ""
                    }

                    rating={
                      item.vote_average ||
                      0
                    }

                    mediaType={
                      item.type
                    }

                  />

                )
              )}

            </div>

          </section>

        )}

      </div>

    </main>

  );
}


export default Abyss;