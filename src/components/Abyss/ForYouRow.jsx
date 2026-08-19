import { useRef } from "react";

import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import MovieCard from "../MovieCard";


function ForYouRow({
  recommendations = [],
  loading = false,
}) {

  const rowRef =
    useRef(null);


  // =====================================================
  // SCROLL LEFT
  // =====================================================

  function scrollLeft() {

    if (!rowRef.current) return;


    rowRef.current.scrollBy({
      left: -900,
      behavior: "smooth",
    });

  }


  // =====================================================
  // SCROLL RIGHT
  // =====================================================

  function scrollRight() {

    if (!rowRef.current) return;


    rowRef.current.scrollBy({
      left: 900,
      behavior: "smooth",
    });

  }


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <section
        className="
          relative
          w-full
          py-10
        "
      >

        <div
          className="
            mb-6
            px-8
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-blue-500/10
              "
            >

              <Sparkles
                size={20}
                className="text-blue-400"
              />

            </div>


            <div>

              <h2
                className="
                  text-3xl
                  font-bold
                "
              >
                For You
              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  text-zinc-500
                "
              >
                ABYSS is finding something
                you'll love...
              </p>

            </div>

          </div>

        </div>


        {/* Loading cards */}

        <div
          className="
            flex
            gap-6
            overflow-hidden
            px-8
          "
        >

          {Array.from({
            length: 7,
          }).map(
            (_, index) => (

              <div
                key={index}
                className="
                  h-[360px]
                  w-[220px]
                  flex-shrink-0
                  animate-pulse
                  rounded-2xl
                  bg-zinc-900
                "
              />

            )
          )}

        </div>

      </section>

    );

  }


  // =====================================================
  // NO RESULTS
  // =====================================================

  if (
    !Array.isArray(
      recommendations
    ) ||
    !recommendations.length
  ) {

    return null;

  }


  // =====================================================
  // FOR YOU
  // =====================================================

  return (

    <section
      className="
        relative
        w-full
        py-10
      "
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          mb-6
          px-8
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-blue-500/10
            "
          >

            <Sparkles
              size={20}
              className="text-blue-400"
            />

          </div>


          <div>

            <h2
              className="
                text-3xl
                font-bold
              "
            >
              For You
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-zinc-500
              "
            >
              Personalized by ABYSS
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          MOVIE ROW
      ================================================= */}

      <div
        className="
          relative
        "
      >


        {/* =================================================
            LEFT ARROW
        ================================================= */}

        <button
          onClick={scrollLeft}

          className="
            absolute
            left-2
            top-1/2
            z-30
            flex
            h-12
            w-12
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            bg-black/80
            text-white
            opacity-100
            shadow-xl
            backdrop-blur-md
            transition-all
            duration-300
            hover:scale-110
            hover:bg-black
          "

          aria-label="
            Previous recommendations
          "
        >

          <ChevronLeft
            size={26}
          />

        </button>


        {/* =================================================
            CARDS
        ================================================= */}

        <div
          ref={rowRef}

          className="
            flex
            gap-6
            overflow-x-auto
            scroll-smooth
            px-8
            pb-4
          "

          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >

          {recommendations.map(
            (item, index) => {

              // =================================================
              // ABYSS FAVORITE OBJECT
              //
              // movieId
              // title
              // poster
              // year
              // rating
              // type
              // =================================================

              const movieId =
                item.movieId ??
                item.id;


              const title =
                item.title ||
                item.name ||
                "Untitled";


              const poster =
                item.poster ||
                item.poster_path ||
                null;


              const rating =
                Number(
                  item.rating ??
                  item.vote_average ??
                  0
                );


              const type =
                item.type ||
                item.media_type ||
                "movie";


              const year =
                item.year ||
                (
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
                );


              return (

                <div
                  key={
                    `${type}-${movieId}-${index}`
                  }

                  className="
                    w-[220px]
                    flex-shrink-0
                  "
                >

                  <MovieCard

                    id={
                      movieId
                    }


                    title={
                      title
                    }


                    name={
                      item.name ||
                      title
                    }


                    poster={
                      poster
                    }


                    year={
                      year
                    }


                    rating={
                      rating
                    }


                    mediaType={
                      type
                    }

                  />

                </div>

              );

            }
          )}

        </div>


        {/* =================================================
            RIGHT ARROW
        ================================================= */}

        <button
          onClick={scrollRight}

          className="
            absolute
            right-2
            top-1/2
            z-30
            flex
            h-12
            w-12
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            bg-black/80
            text-white
            opacity-100
            shadow-xl
            backdrop-blur-md
            transition-all
            duration-300
            hover:scale-110
            hover:bg-black
          "

          aria-label="
            Next recommendations
          "
        >

          <ChevronRight
            size={26}
          />

        </button>

      </div>

    </section>

  );

}


export default ForYouRow;