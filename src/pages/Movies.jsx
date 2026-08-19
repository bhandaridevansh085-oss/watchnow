import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getGenres,
  getWatchProviders,
  discoverMovies,
} from "../services/movieApi";

import MovieCard from "../components/MovieCard";

function Movies() {
  // =====================================================
  // DATA
  // =====================================================

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [providers, setProviders] = useState([]);

  // =====================================================
  // FILTERS
  // =====================================================

  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("popularity.desc");
  const [provider, setProvider] = useState("");
  const [country, setCountry] = useState("");

  // =====================================================
  // PAGINATION
  // =====================================================

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // OBSERVER
  // =====================================================

  const observerRef = useRef(null);

  // =====================================================
  // LOAD FILTER DATA
  // =====================================================

  useEffect(() => {
    async function loadFilters() {
      try {
        const [genreData, providerData] =
          await Promise.all([
            getGenres(),
            getWatchProviders(),
          ]);

        setGenres(genreData || []);

        const uniqueProviders =
          (providerData || []).filter(
            (providerItem, index, array) =>
              index ===
              array.findIndex(
                (item) =>
                  item.provider_id ===
                  providerItem.provider_id
              )
          );

        setProviders(uniqueProviders);
      } catch (error) {
        console.error(
          "Filter loading error:",
          error
        );
      }
    }

    loadFilters();
  }, []);

  // =====================================================
  // LOAD MOVIES
  // =====================================================

  async function loadMovies(
    pageNumber,
    reset = false
  ) {
    if (
      pageNumber > 1 &&
      loadingMore
    ) {
      return;
    }

    if (reset) {
      setLoading(true);
      setError("");
    } else {
      setLoadingMore(true);
    }

    try {
      const response =
        await discoverMovies({
          page: pageNumber,
          genre,
          year,
          sort,
          provider,
          country,
        });

      const data =
        response?.results || [];

      setHasMore(
        pageNumber <
          (response?.total_pages || 1)
      );

      setMovies((previous) => {
        if (reset) {
          return data;
        }

        const existingIds =
          new Set(
            previous.map(
              (movie) => movie.id
            )
          );

        const newMovies =
          data.filter(
            (movie) =>
              !existingIds.has(movie.id)
          );

        return [
          ...previous,
          ...newMovies,
        ];
      });

      setPage(pageNumber);
    } catch (error) {
      console.error(
        "Movie loading error:",
        error
      );

      if (reset) {
        setError(
          "Failed to load movies."
        );
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  // =====================================================
  // FILTER CHANGE
  // =====================================================

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);

    loadMovies(1, true);
  }, [
    genre,
    year,
    sort,
    provider,
    country,
  ]);

  // =====================================================
  // LOAD NEXT PAGE
  // =====================================================

  function loadNextPage() {
    if (
      loading ||
      loadingMore ||
      !hasMore
    ) {
      return;
    }

    loadMovies(
      page + 1,
      false
    );
  }

  // =====================================================
  // INFINITE SCROLL
  // =====================================================

  useEffect(() => {
    const observer =
      new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting
          ) {
            loadNextPage();
          }
        },
        {
          rootMargin: "500px",
        }
      );

    const element =
      observerRef.current;

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [
    page,
    loading,
    loadingMore,
    hasMore,
  ]);

  // =====================================================
  // YEARS
  // =====================================================

  const years = useMemo(() => {
    const currentYear =
      new Date().getFullYear();

    return Array.from(
      {
        length:
          currentYear - 1979,
      },
      (_, index) =>
        currentYear - index
    );
  }, []);

  // =====================================================
  // COUNTRIES
  // =====================================================

  const countries = [
    {
      code: "IN",
      name: "India",
    },
    {
      code: "US",
      name: "United States",
    },
    {
      code: "GB",
      name: "United Kingdom",
    },
    {
      code: "CA",
      name: "Canada",
    },
    {
      code: "AU",
      name: "Australia",
    },
    {
      code: "KR",
      name: "South Korea",
    },
    {
      code: "JP",
      name: "Japan",
    },
    {
      code: "FR",
      name: "France",
    },
    {
      code: "DE",
      name: "Germany",
    },
    {
      code: "ES",
      name: "Spain",
    },
  ];

  // =====================================================
  // BACKGROUND
  // =====================================================

  const backgroundMovie =
    movies[0];

  const backgroundImage =
    backgroundMovie?.backdrop_path ||
    backgroundMovie?.poster_path;

  // =====================================================
  // INITIAL LOADING
  // =====================================================

  if (
    loading &&
    movies.length === 0
  ) {
    return (
      <main
        className="
          min-h-screen
          bg-[#050505]
          px-6
          pb-20
          pt-36
          text-white
        "
      >
        <div
          className="
            mx-auto
            max-w-[1500px]
          "
        >
          <div
            className="
              h-12
              w-48
              animate-pulse
              rounded-lg
              bg-white/10
            "
          />

          <div
            className="
              mt-4
              h-5
              w-72
              animate-pulse
              rounded
              bg-white/10
            "
          />

          <div
            className="
              mt-10
              grid
              grid-cols-2
              gap-x-5
              gap-y-9
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              xl:grid-cols-6
            "
          >
            {Array.from({
              length: 18,
            }).map((_, index) => (
              <div
                key={index}
                className="
                  aspect-[2/3]
                  w-full
                  animate-pulse
                  rounded-[14px]
                  bg-white/10
                "
              />
            ))}
          </div>
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
        relative
        min-h-screen
        overflow-hidden
        bg-[#050505]
        text-white
      "
    >
      {/* =================================================
          CINEMATIC BACKGROUND
      ================================================= */}

      {backgroundImage && (
        <div
          className="
            pointer-events-none
            absolute
            left-0
            right-0
            top-0
            h-[700px]
            overflow-hidden
          "
        >
          <div
            className="
              absolute
              inset-[-60px]
              scale-110
              bg-cover
              bg-center
              opacity-30
              blur-3xl
            "
            style={{
              backgroundImage:
                `url(https://image.tmdb.org/t/p/original${backgroundImage})`,
            }}
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-b
              from-black/20
              via-black/50
              to-[#050505]
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-black/60
              via-transparent
              to-black/40
            "
          />
        </div>
      )}

      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1500px]
          px-6
          pb-24
          pt-36
          sm:px-8
          lg:px-10
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            flex-col
            gap-7
            xl:flex-row
            xl:items-end
            xl:justify-between
          "
        >
          {/* TITLE */}

          <div>
            <h1
              className="
                text-5xl
                font-black
                tracking-tight
                sm:text-6xl
              "
            >
              Movies
            </h1>

            <p
              className="
                mt-3
                text-lg
                text-white/60
              "
            >
              Discover new movies to watch
            </p>
          </div>

          {/* =================================================
              FILTERS
          ================================================= */}

          <div
            className="
              flex
              flex-wrap
              gap-3
            "
          >
            {/* GENRE */}

            <select
              value={genre}
              onChange={(e) =>
                setGenre(e.target.value)
              }
              className="
                h-11
                w-[145px]
                rounded-full
                border
                border-white/10
                bg-white/[0.07]
                px-5
                text-sm
                text-white
                outline-none
                backdrop-blur-xl
                transition
                hover:bg-white/[0.12]
                focus:border-white/25
              "
            >
              <option
                value=""
                className="bg-zinc-900"
              >
                Genre
              </option>

              {genres.map(
                (item) => (
                  <option
                    key={item.id}
                    value={item.id}
                    className="bg-zinc-900"
                  >
                    {item.name}
                  </option>
                )
              )}
            </select>

            {/* YEAR */}

            <select
              value={year}
              onChange={(e) =>
                setYear(e.target.value)
              }
              className="
                h-11
                w-[145px]
                rounded-full
                border
                border-white/10
                bg-white/[0.07]
                px-5
                text-sm
                text-white
                outline-none
                backdrop-blur-xl
                transition
                hover:bg-white/[0.12]
                focus:border-white/25
              "
            >
              <option
                value=""
                className="bg-zinc-900"
              >
                Year
              </option>

              {years.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                    className="bg-zinc-900"
                  >
                    {item}
                  </option>
                )
              )}
            </select>

            {/* SORT */}

            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="
                h-11
                w-[145px]
                rounded-full
                border
                border-white/10
                bg-white/[0.07]
                px-5
                text-sm
                text-white
                outline-none
                backdrop-blur-xl
                transition
                hover:bg-white/[0.12]
                focus:border-white/25
              "
            >
              <option
                value="popularity.desc"
                className="bg-zinc-900"
              >
                Popular
              </option>

              <option
                value="vote_average.desc"
                className="bg-zinc-900"
              >
                Top Rated
              </option>

              <option
                value="primary_release_date.desc"
                className="bg-zinc-900"
              >
                Newest
              </option>
            </select>

            {/* PROVIDER */}

            <select
              value={provider}
              onChange={(e) =>
                setProvider(e.target.value)
              }
              className="
                h-11
                w-[145px]
                rounded-full
                border
                border-white/10
                bg-white/[0.07]
                px-5
                text-sm
                text-white
                outline-none
                backdrop-blur-xl
                transition
                hover:bg-white/[0.12]
                focus:border-white/25
              "
            >
              <option
                value=""
                className="bg-zinc-900"
              >
                Provider
              </option>

              {providers.map(
                (item) => (
                  <option
                    key={item.provider_id}
                    value={item.provider_id}
                    className="bg-zinc-900"
                  >
                    {item.provider_name}
                  </option>
                )
              )}
            </select>

            {/* COUNTRY */}

            <select
              value={country}
              onChange={(e) =>
                setCountry(e.target.value)
              }
              className="
                h-11
                w-[145px]
                rounded-full
                border
                border-white/10
                bg-white/[0.07]
                px-5
                text-sm
                text-white
                outline-none
                backdrop-blur-xl
                transition
                hover:bg-white/[0.12]
                focus:border-white/25
              "
            >
              <option
                value=""
                className="bg-zinc-900"
              >
                Country
              </option>

              {countries.map(
                (item) => (
                  <option
                    key={item.code}
                    value={item.code}
                    className="bg-zinc-900"
                  >
                    {item.name}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {/* =================================================
            MOVIE GRID
        ================================================= */}

        <div
          className="
            mt-10
            grid
            grid-cols-2
            gap-x-5
            gap-y-9
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
          "
        >
          {movies.map(
            (movie) => (
              <div
                key={movie.id}
                className="
                  w-full
                  max-w-[215px]
                "
              >
                <MovieCard
                  id={movie.id}
                  title={movie.title}
                  poster_path={
                    movie.poster_path
                  }
                  release_date={
                    movie.release_date
                  }
                  rating={
                    movie.vote_average
                  }
                  mediaType="movie"
                />
              </div>
            )
          )}
        </div>

        {/* =================================================
            INFINITE SCROLL
        ================================================= */}

        <div
          ref={observerRef}
          className="
            flex
            min-h-[120px]
            items-center
            justify-center
          "
        >
          {loadingMore && (
            <div
              className="
                flex
                items-center
                gap-3
                text-sm
                text-white/50
              "
            >
              <div
                className="
                  h-5
                  w-5
                  animate-spin
                  rounded-full
                  border-2
                  border-white/20
                  border-t-white
                "
              />

              Loading more movies...
            </div>
          )}

          {!hasMore &&
            movies.length > 0 && (
              <p
                className="
                  text-sm
                  text-white/30
                "
              >
                You've reached the end.
              </p>
            )}
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className="
              flex
              min-h-[300px]
              items-center
              justify-center
            "
          >
            <p className="text-red-400">
              {error}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Movies;