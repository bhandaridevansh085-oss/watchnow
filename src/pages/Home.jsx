import { useEffect, useState } from "react";

import HeroBanner from "../components/Hero/HeroBanner";
import MovieRow from "../components/MovieRow";
import Footer from "../components/Footer";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import ForYouRow from "../components/Abyss/ForYouRow";

import { useFavorites } from "../context/FavoritesContext";

import {
  searchMovies,
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getTrendingShows,
  getPopularShows,
  getTopRatedShows,
} from "../services/movieApi";


function Home() {

  const [search, setSearch] =
    useState("");

  const [searchResults, setSearchResults] =
    useState([]);

  const [trending, setTrending] =
    useState([]);

  const [popular, setPopular] =
    useState([]);

  const [topRated, setTopRated] =
    useState([]);

  const [nowPlaying, setNowPlaying] =
    useState([]);

  const [upcoming, setUpcoming] =
    useState([]);


  const [trendingShows, setTrendingShows] =
    useState([]);

  const [popularShows, setPopularShows] =
    useState([]);

  const [topRatedShows, setTopRatedShows] =
    useState([]);


  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // ABYSS
  // =====================================================

  const {
    abyssRecommendations,
    abyssLoading,
  } = useFavorites();


  // =====================================================
  // LOAD HOME PAGE
  // =====================================================

  async function loadHomePage() {

    setLoading(true);

    setError("");


    try {

      const [
        trendingData,
        popularData,
        topRatedData,
        nowPlayingData,
        upcomingData,
        trendingShowsData,
        popularShowsData,
        topRatedShowsData,
      ] = await Promise.all([

        getTrendingMovies(),

        getPopularMovies(),

        getTopRatedMovies(),

        getNowPlayingMovies(),

        getUpcomingMovies(),

        getTrendingShows(),

        getPopularShows(),

        getTopRatedShows(),

      ]);


      setTrending(
        trendingData
      );


      setPopular(
        popularData
      );


      setTopRated(
        topRatedData
      );


      setNowPlaying(
        nowPlayingData
      );


      setUpcoming(
        upcomingData
      );


      setTrendingShows(
        trendingShowsData
      );


      setPopularShows(
        popularShowsData
      );


      setTopRatedShows(
        topRatedShowsData
      );


    } catch (err) {

      console.error(err);

      setError(
        "Failed to load movies."
      );


    } finally {

      setLoading(false);

    }

  }


  // =====================================================
  // SEARCH
  // =====================================================

  async function handleSearch() {

    if (!search.trim()) {

      return;

    }


    setLoading(true);

    setError("");


    try {

      const data =
        await searchMovies(search);


      if (data.length === 0) {

        setSearchResults([]);

        setError(
          "No movies found."
        );


      } else {

        setSearchResults(
          data
        );

      }


    } catch (err) {

      console.error(err);

      setError(
        "Something went wrong."
      );


    } finally {

      setLoading(false);

    }

  }


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    loadHomePage();

  }, []);


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <main
      className="
        relative
        min-h-screen
        w-full
        overflow-x-hidden
        bg-[#050505]
        text-white
      "
    >


      {/* =================================================
          CINEMATIC AMBIENT BACKGROUND
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          overflow-hidden
        "
      >

        {/* BASE */}

        <div
          className="
            absolute
            inset-0
            bg-[#050505]
          "
        />


        {/* BLUE */}

        <div
          className="
            absolute
            -left-[20%]
            top-[15%]
            h-[900px]
            w-[900px]
            rounded-full
            bg-blue-600/10
            blur-[180px]
          "
        />


        {/* PURPLE */}

        <div
          className="
            absolute
            right-[-20%]
            top-[25%]
            h-[850px]
            w-[850px]
            rounded-full
            bg-purple-600/10
            blur-[180px]
          "
        />


        {/* GREEN */}

        <div
          className="
            absolute
            -left-[20%]
            top-[45%]
            h-[900px]
            w-[900px]
            rounded-full
            bg-emerald-600/10
            blur-[190px]
          "
        />


        {/* WARM ORANGE */}

        <div
          className="
            absolute
            right-[-20%]
            top-[58%]
            h-[900px]
            w-[900px]
            rounded-full
            bg-orange-600/[0.08]
            blur-[200px]
          "
        />


        {/* CYAN */}

        <div
          className="
            absolute
            left-[20%]
            top-[80%]
            h-[800px]
            w-[800px]
            rounded-full
            bg-cyan-600/[0.07]
            blur-[190px]
          "
        />

      </div>


      {/* =================================================
          HERO
      ================================================= */}

      <div className="relative z-10">

        <HeroBanner
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
        />

      </div>


      {/* =================================================
          CONTENT
      ================================================= */}

      <section
        className="
          relative
          z-10
          w-full
          bg-transparent
        "
      >


        {/* =================================================
            ABYSS — FOR YOU

            IMPORTANT:
            This is OUTSIDE the normal loading/error
            condition so ABYSS can render independently.
        ================================================= */}

        <ForYouRow
          recommendations={
            abyssRecommendations
          }

          loading={
            abyssLoading
          }
        />


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="w-full">

            <LoadingSkeleton />

            <LoadingSkeleton />

            <LoadingSkeleton />

          </div>

        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div
            className="
              flex
              min-h-[300px]
              w-full
              items-center
              justify-center
            "
          >

            <h1
              className="
                text-xl
                text-red-500
              "
            >

              {error}

            </h1>

          </div>

        )}


        {/* =================================================
            NORMAL CONTENT
        ================================================= */}

        {!loading && !error && (

          <div className="w-full">


            {/* =================================================
                SEARCH
            ================================================= */}

            {searchResults.length > 0 && (

              <MovieRow
                title="Search Results"
                movies={
                  searchResults
                }
              />

            )}


            {/* =================================================
                TRENDING
            ================================================= */}

            <MovieRow
              title="Trending Today"
              movies={
                trending
              }
            />


            {/* =================================================
                TOP RATED
            ================================================= */}

            <MovieRow
              title="Top Rated"
              movies={
                topRated
              }
            />


            {/* =================================================
                NOW PLAYING
            ================================================= */}

            <MovieRow
              title="Now Playing"
              movies={
                nowPlaying
              }
            />


            {/* =================================================
                UPCOMING
            ================================================= */}

            <MovieRow
              title="Upcoming Movies"
              movies={
                upcoming
              }
            />


            {/* =================================================
                POPULAR
            ================================================= */}

            <MovieRow
              title="Popular Movies"
              movies={
                popular
              }
            />


            {/* =================================================
                TRENDING SHOWS
            ================================================= */}

            <MovieRow
              title="Trending Shows"
              movies={
                trendingShows
              }
            />


            {/* =================================================
                POPULAR SHOWS
            ================================================= */}

            <MovieRow
              title="Popular Series"
              movies={
                popularShows
              }
            />


            {/* =================================================
                TOP RATED SHOWS
            ================================================= */}

            <MovieRow
              title="Top Rated Shows"
              movies={
                topRatedShows
              }
            />

          </div>

        )}

      </section>


      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="relative z-10">

        <Footer />

      </div>


    </main>

  );

}


export default Home;