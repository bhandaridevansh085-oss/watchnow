import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Calendar,
  MapPin,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { motion } from "framer-motion";

import MovieRow from "../components/MovieRow";

import {
  getPersonDetails,
  getPersonCredits,
} from "../services/movieApi";


function PersonDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [showFullBio, setShowFullBio] = useState(false);


  /* =====================================================
     LOAD PERSON
  ===================================================== */

  useEffect(() => {

    async function loadPerson() {

      try {

        const [
          details,
          personCredits,
        ] = await Promise.all([
          getPersonDetails(id),
          getPersonCredits(id),
        ]);


        setPerson(details);


        /* -----------------------------------------------
           CLEAN CREDITS
        ------------------------------------------------ */

        const seen = new Set();

        const cleanedCredits =
          (personCredits || [])
            .filter(
              (item) =>
                item.poster_path &&
                (
                  item.media_type === "movie" ||
                  item.media_type === "tv"
                )
            )
            .filter((item) => {

              const key =
                `${item.media_type}-${item.id}`;

              if (seen.has(key)) {
                return false;
              }

              seen.add(key);

              return true;

            })
            .sort(
              (a, b) =>
                (b.popularity || 0) -
                (a.popularity || 0)
            );


        setCredits(cleanedCredits);

      } catch (error) {

        console.error(
          "Failed to load person:",
          error
        );

      }

    }

    loadPerson();

  }, [id]);


  /* =====================================================
     LOADING
  ===================================================== */

  if (!person) {

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
            h-10
            w-10
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


  /* =====================================================
     IMAGE
  ===================================================== */

  const profileImage = person.profile_path
    ? `https://image.tmdb.org/t/p/original${person.profile_path}`
    : null;


  /* =====================================================
     BIO
  ===================================================== */

  const biography =
    person.biography ||
    "No biography available.";

  const bioLimit = 650;

  const hasLongBio =
    biography.length > bioLimit;

  const displayedBio =
    showFullBio || !hasLongBio
      ? biography
      : `${biography.slice(0, bioLimit)}...`;


  /* =====================================================
     PAGE
  ===================================================== */

  return (

    <main
      className="
        min-h-screen
        overflow-x-hidden
        bg-[#050505]
        text-white
      "
    >

      {/* =================================================
          CINEMATIC BACKGROUND
      ================================================= */}

      {profileImage && (

        <div
          className="
            pointer-events-none
            fixed
            inset-0
            -z-20
          "
        >

          <img
            src={profileImage}
            alt=""
            className="
              h-full
              w-full
              object-cover
              object-center
              opacity-20
              blur-[6px]
            "
          />

        </div>

      )}


      {/* BACKGROUND DARKNESS */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          -z-10
          bg-black/80
        "
      />


      {/* =================================================
          TOP GRADIENT
      ================================================= */}

      <div
        className="
          pointer-events-none
          fixed
          inset-x-0
          top-0
          -z-10
          h-[400px]
          bg-gradient-to-b
          from-black
          via-black/70
          to-transparent
        "
      />


      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <button
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="
          fixed
          left-6
          top-24
          z-40
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-white/10
          bg-black/50
          text-white
          backdrop-blur-xl
          transition
          duration-300
          hover:bg-white/15
        "
      >

        <ArrowLeft size={21} />

      </button>


      {/* =================================================
          HERO
      ================================================= */}

      <section
        className="
          mx-auto
          w-full
          max-w-[1450px]
          px-6
          pb-10
          pt-28
          sm:px-8
          lg:px-10
        "
      >

        <div
          className="
            grid
            grid-cols-1
            gap-10
            lg:grid-cols-[280px_minmax(0,1fr)]
            lg:gap-12
          "
        >

          {/* =================================================
              PROFILE IMAGE
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="
              mx-auto
              w-[230px]
              sm:w-[250px]
              lg:mx-0
              lg:w-[280px]
            "
          >

            <div
              className="
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-zinc-900
                shadow-2xl
              "
            >

              {person.profile_path ? (

                <img
                  src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                  alt={person.name}
                  className="
                    aspect-[2/3]
                    w-full
                    object-cover
                  "
                />

              ) : (

                <div
                  className="
                    flex
                    aspect-[2/3]
                    items-center
                    justify-center
                    text-zinc-500
                  "
                >
                  No Image
                </div>

              )}

            </div>

          </motion.div>


          {/* =================================================
              INFORMATION
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="
              min-w-0
              self-center
            "
          >

            {/* NAME */}

            <h1
              className="
                text-5xl
                font-black
                tracking-tight
                sm:text-6xl
                lg:text-7xl
              "
            >
              {person.name}
            </h1>


            {/* DEPARTMENT */}

            {person.known_for_department && (

              <p
                className="
                  mt-3
                  text-sm
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-blue-400
                "
              >
                {person.known_for_department}
              </p>

            )}


            {/* =================================================
                META
            ================================================= */}

            <div
              className="
                mt-6
                flex
                flex-wrap
                items-center
                gap-x-6
                gap-y-3
                text-sm
                text-zinc-300
              "
            >

              {/* POPULARITY */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <Star
                  size={17}
                  fill="currentColor"
                  className="text-yellow-400"
                />

                <span>
                  {Number(
                    person.popularity || 0
                  ).toFixed(1)}
                </span>

              </div>


              {/* BIRTHDAY */}

              {person.birthday && (

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <Calendar size={16} />

                  <span>
                    {person.birthday}
                  </span>

                </div>

              )}


              {/* BIRTHPLACE */}

              {person.place_of_birth && (

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <MapPin size={16} />

                  <span>
                    {person.place_of_birth}
                  </span>

                </div>

              )}

            </div>


            {/* =================================================
                BIOGRAPHY
            ================================================= */}

            <div className="mt-9 max-w-4xl">

              <h2
                className="
                  text-2xl
                  font-bold
                "
              >
                Biography
              </h2>


              <p
                className="
                  mt-4
                  text-[15px]
                  leading-7
                  text-zinc-300
                  sm:text-base
                "
              >
                {displayedBio}
              </p>


              {/* READ MORE */}

              {hasLongBio && (

                <button
                  onClick={() =>
                    setShowFullBio(
                      !showFullBio
                    )
                  }
                  className="
                    mt-3
                    flex
                    items-center
                    gap-1.5
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:text-blue-400
                  "
                >

                  {showFullBio
                    ? "Read Less"
                    : "Read More"}

                  {showFullBio ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}

                </button>

              )}

            </div>

          </motion.div>

        </div>

      </section>


      {/* =================================================
          KNOWN FOR
      ================================================= */}

      {credits.length > 0 && (

        <section
          className="
            mx-auto
            w-full
            max-w-[1450px]
            px-6
            sm:px-8
            lg:px-10
          "
        >

          <MovieRow
            title="Known For"
            movies={credits.slice(0, 20)}
          />

        </section>

      )}


      {/* =================================================
          FILMOGRAPHY
      ================================================= */}

      {credits.length > 0 && (

        <section
          className="
            mx-auto
            w-full
            max-w-[1400px]
            px-6
            pb-24
            pt-6
            sm:px-8
            lg:px-10
          "
        >

          <h2
            className="
              mb-6
              text-2xl
              font-bold
              sm:text-3xl
            "
          >
            Filmography
          </h2>


          <div
            className="
              grid
              gap-3
            "
          >

            {credits
              .slice(0, 30)
              .map((item) => {

                const title =
                  item.title ||
                  item.name ||
                  "Unknown";

                const date =
                  item.release_date ||
                  item.first_air_date ||
                  "";

                const year =
                  date
                    ? date.slice(0, 4)
                    : "N/A";

                const character =
                  item.character ||
                  "Actor";


                return (

                  <motion.div
                    key={`${item.media_type}-${item.id}`}
                    whileHover={{
                      x: 4,
                    }}
                    onClick={() => {

                      if (
                        item.media_type === "tv"
                      ) {

                        navigate(
                          `/tv/${item.id}`
                        );

                      } else {

                        navigate(
                          `/movie/${item.id}`
                        );

                      }

                    }}
                    className="
                      group
                      flex
                      cursor-pointer
                      items-center
                      gap-4
                      rounded-xl
                      border
                      border-white/[0.06]
                      bg-white/[0.025]
                      p-3
                      transition-all
                      duration-300
                      hover:border-white/10
                      hover:bg-white/[0.06]
                    "
                  >

                    {/* POSTER */}

                    <div
                      className="
                        h-20
                        w-14
                        flex-shrink-0
                        overflow-hidden
                        rounded-lg
                        bg-zinc-900
                      "
                    >

                      <img
                        src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
                        alt={title}
                        loading="lazy"
                        className="
                          h-full
                          w-full
                          object-cover
                          transition
                          duration-300
                          group-hover:scale-105
                        "
                      />

                    </div>


                    {/* INFORMATION */}

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >

                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-2
                        "
                      >

                        <h3
                          className="
                            truncate
                            font-semibold
                            transition
                            group-hover:text-blue-400
                          "
                        >
                          {title}
                        </h3>

                        <span
                          className="
                            text-zinc-600
                          "
                        >
                          •
                        </span>

                        <span
                          className="
                            text-sm
                            text-zinc-500
                          "
                        >
                          {year}
                        </span>

                      </div>


                      <p
                        className="
                          mt-1
                          truncate
                          text-sm
                          text-zinc-500
                        "
                      >
                        {character}
                      </p>

                    </div>


                    {/* RATING */}

                    <div
                      className="
                        hidden
                        items-center
                        gap-1
                        text-sm
                        text-zinc-400
                        sm:flex
                      "
                    >

                      <Star
                        size={14}
                        fill="currentColor"
                        className="text-yellow-400"
                      />

                      {Number(
                        item.vote_average || 0
                      ).toFixed(1)}

                    </div>

                  </motion.div>

                );

              })}

          </div>

        </section>

      )}

    </main>

  );

}


export default PersonDetails;