import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  params: {
    api_key: API_KEY,
  },
});


/* =========================================================
   MOVIES
========================================================= */

/* -------------------------
   SEARCH MOVIES
------------------------- */

export async function searchMovies(query, page = 1) {
  try {
    const response = await api.get("/search/movie", {
      params: {
        query,
        page,
      },
    });

    return response.data.results;

  } catch (error) {
    console.error(error);
    throw error;
  }
}


/* -------------------------
   TRENDING MOVIES
------------------------- */

export async function getTrendingMovies(page = 1) {
  try {
    const response = await api.get(
      "/trending/movie/week",
      {
        params: {
          page,
        },
      }
    );

    return response.data.results;

  } catch (error) {
    console.error(error);
    return [];
  }
}


/* -------------------------
   POPULAR MOVIES
------------------------- */

export async function getPopularMovies(page = 1) {
  try {
    const response = await api.get(
      "/movie/popular",
      {
        params: {
          page,
        },
      }
    );

    return response.data.results;

  } catch (error) {
    console.error(error);
    return [];
  }
}


/* -------------------------
   TOP RATED MOVIES
------------------------- */

export async function getTopRatedMovies(page = 1) {
  try {
    const response = await api.get(
      "/movie/top_rated",
      {
        params: {
          page,
        },
      }
    );

    return response.data.results;

  } catch (error) {
    console.error(error);
    return [];
  }
}


/* -------------------------
   MOVIE DETAILS
------------------------- */

export async function getMovieDetails(id) {
  try {
    const response = await api.get(
      `/movie/${id}`
    );

    return response.data;

  } catch (error) {
    console.error(error);
    throw error;
  }
}


/* -------------------------
   MOVIE CREDITS
------------------------- */

export async function getMovieCredits(id) {
  try {
    const response = await api.get(
      `/movie/${id}/credits`
    );

    return response.data.cast;

  } catch (error) {
    console.error(error);
    return [];
  }
}


/* =========================================================
   MOVIE VIDEOS
========================================================= */

export async function getMovieVideos(id) {
  try {

    const response = await api.get(
      `/movie/${id}/videos`
    );

    const videos =
      response.data.results || [];


    /*
      1. Prefer official YouTube trailer
    */

    const officialTrailer =
      videos.find(
        (video) =>
          video.site === "YouTube" &&
          video.type === "Trailer" &&
          video.official === true &&
          video.key
      );


    if (officialTrailer) {
      return officialTrailer;
    }


    /*
      2. Otherwise use any YouTube trailer
    */

    const trailer =
      videos.find(
        (video) =>
          video.site === "YouTube" &&
          video.type === "Trailer" &&
          video.key
      );


    if (trailer) {
      return trailer;
    }


    /*
      3. If no trailer exists,
         use a YouTube teaser.
    */

    const teaser =
      videos.find(
        (video) =>
          video.site === "YouTube" &&
          video.type === "Teaser" &&
          video.key
      );


    return teaser || null;

  } catch (error) {

    console.error(
      "Failed to load movie trailer:",
      error
    );

    return null;
  }
}


/* =========================================================
   MOVIE LOGO
========================================================= */

export async function getMovieLogo(id) {
  try {

    const response = await api.get(
      `/movie/${id}/images`,
      {
        params: {
          include_image_language:
            "en,null",
        },
      }
    );

    const logos =
      response.data.logos || [];


    if (logos.length === 0) {
      return null;
    }


    const englishLogo =
      logos.find(
        (logo) =>
          logo.iso_639_1 === "en"
      );


    const selectedLogo =
      englishLogo || logos[0];


    return selectedLogo.file_path;

  } catch (error) {

    console.error(
      "Logo error:",
      error
    );

    return null;
  }
}


/* =========================================================
   SIMILAR / RECOMMENDED MOVIES
========================================================= */

export async function getSimilarMovies(id) {
  try {

    const response = await api.get(
      `/movie/${id}/recommendations`,
      {
        params: {
          page: 1,
        },
      }
    );

    return response.data.results || [];

  } catch (error) {

    console.error(
      "Movie recommendations error:",
      error
    );

    return [];
  }
}


/* =========================================================
   GENRES
========================================================= */

export async function getGenres() {
  try {

    const response = await api.get(
      "/genre/movie/list"
    );

    return response.data.genres;

  } catch (error) {

    console.error(error);

    return [];
  }
}


/* -------------------------
   MOVIES BY GENRE
------------------------- */

export async function getMoviesByGenre(
  id,
  page = 1
) {

  try {

    const response = await api.get(
      "/discover/movie",
      {
        params: {
          with_genres: id,
          page,
        },
      }
    );

    return response.data;

  } catch (error) {

    console.error(error);

    return {
      results: [],
      page: 1,
      total_pages: 1,
    };
  }
}


/* =========================================================
   SEARCH
========================================================= */


/* -------------------------
   SEARCH SUGGESTIONS
------------------------- */

export async function getSearchSuggestions(
  query
) {

  try {

    if (!query.trim()) {
      return [];
    }

    const response = await api.get(
      "/search/movie",
      {
        params: {
          query,
        },
      }
    );

    return response.data.results.slice(
      0,
      6
    );

  } catch (error) {

    console.error(error);

    return [];
  }
}


/* -------------------------
   MULTI SEARCH
------------------------- */

export async function searchMulti(
  query,
  page = 1
) {

  try {

    if (!query.trim()) {
      return [];
    }

    const response = await api.get(
      "/search/multi",
      {
        params: {
          query,
          page,
        },
      }
    );

    return response.data.results.filter(
      (item) =>
        item.media_type === "movie" ||
        item.media_type === "tv"
    );

  } catch (error) {

    console.error(error);

    return [];
  }
}


/* =========================================================
   FEATURED HERO MOVIES
========================================================= */

export async function getFeaturedMovies() {

  try {

    const response = await api.get(
      "/trending/movie/week"
    );

    return response.data.results.slice(
      0,
      6
    );

  } catch (error) {

    console.error(error);

    return [];
  }
}


/* =========================================================
   NOW PLAYING / UPCOMING
========================================================= */


/* -------------------------
   NOW PLAYING
------------------------- */

export async function getNowPlayingMovies(
  page = 1
) {

  try {

    const response = await api.get(
      "/movie/now_playing",
      {
        params: {
          page,
        },
      }
    );

    return response.data.results;

  } catch (error) {

    console.error(error);

    return [];
  }
}


/* -------------------------
   UPCOMING
------------------------- */

export async function getUpcomingMovies(
  page = 1
) {

  try {

    const response = await api.get(
      "/movie/upcoming",
      {
        params: {
          page,
        },
      }
    );

    return response.data.results;

  } catch (error) {

    console.error(error);

    return [];
  }
}


/* =========================================================
   TV SHOWS
========================================================= */


/* -------------------------
   TRENDING SHOWS
------------------------- */

export async function getTrendingShows(
  page = 1
) {

  try {

    const response = await api.get(
      "/trending/tv/week",
      {
        params: {
          page,
        },
      }
    );

    return response.data.results;

  } catch (error) {

    console.error(error);

    return [];
  }
}


/* -------------------------
   POPULAR SHOWS
------------------------- */

export async function getPopularShows(
  page = 1
) {

  try {

    const response = await api.get(
      "/tv/popular",
      {
        params: {
          page,
        },
      }
    );

    return response.data.results;

  } catch (error) {

    console.error(error);

    return [];
  }
}


/* -------------------------
   TOP RATED SHOWS
------------------------- */

export async function getTopRatedShows(
  page = 1
) {

  try {

    const response = await api.get(
      "/tv/top_rated",
      {
        params: {
          page,
        },
      }
    );

    return response.data.results;

  } catch (error) {

    console.error(error);

    return [];
  }
}


/* -------------------------
   TV DETAILS
------------------------- */

export async function getTVDetails(id) {

  try {

    const response = await api.get(
      `/tv/${id}`
    );

    return response.data;

  } catch (error) {

    console.error(error);

    throw error;
  }
}


/* -------------------------
   TV CREDITS
------------------------- */

export async function getTVCredits(id) {

  try {

    const response = await api.get(
      `/tv/${id}/credits`
    );

    return response.data.cast;

  } catch (error) {

    console.error(error);

    return [];
  }
}


/* -------------------------
   TV VIDEOS
------------------------- */

export async function getTVVideos(id) {

  try {

    const response = await api.get(
      `/tv/${id}/videos`
    );

    return (
      response.data.results.find(
        (video) =>
          video.site === "YouTube" &&
          video.type === "Trailer"
      ) || null
    );

  } catch (error) {

    console.error(error);

    return null;
  }
}


/* -------------------------
   SIMILAR / RECOMMENDED TV
------------------------- */

export async function getSimilarTV(id) {

  try {

    const response = await api.get(
      `/tv/${id}/recommendations`,
      {
        params: {
          page: 1,
        },
      }
    );

    return response.data.results || [];

  } catch (error) {

    console.error(
      "TV recommendations error:",
      error
    );

    return [];
  }
}


/* =========================================================
   TV SEASONS
========================================================= */

export async function getSeasonDetails(
  id,
  seasonNumber
) {

  try {

    const response = await api.get(
      `/tv/${id}/season/${seasonNumber}`
    );

    return response.data;

  } catch (error) {

    console.error(error);

    return null;
  }
}


/* =========================================================
   PEOPLE
========================================================= */


/* -------------------------
   PERSON DETAILS
------------------------- */

export async function getPersonDetails(id) {

  try {

    const response = await api.get(
      `/person/${id}`
    );

    return response.data;

  } catch (error) {

    console.error(error);

    return null;
  }
}


/* -------------------------
   PERSON CREDITS
------------------------- */

export async function getPersonCredits(id) {

  try {

    const response = await api.get(
      `/person/${id}/combined_credits`
    );

    return response.data.cast;

  } catch (error) {

    console.error(error);

    return [];
  }
}


/* =========================================================
   WATCH PROVIDERS
========================================================= */

export async function getWatchProviders() {

  try {

    const response = await api.get(
      "/watch/providers/movie",
      {
        params: {
          watch_region: "IN",
          language: "en-US",
        },
      }
    );

    return response.data.results || [];

  } catch (error) {

    console.error(
      "Failed to load providers:",
      error
    );

    return [];
  }
}


/* =========================================================
   DISCOVER MOVIES
========================================================= */

export async function discoverMovies({
  page = 1,
  genre = "",
  year = "",
  sort = "popularity.desc",
  provider = "",
  country = "",
} = {}) {

  try {

    const params = {
      page,
      sort_by: sort,
    };


    if (genre) {
      params.with_genres = genre;
    }


    if (year) {
      params.primary_release_year =
        year;
    }


    if (provider) {

      params.with_watch_providers =
        provider;

      params.watch_region = "IN";
    }


    if (country) {

      params.with_origin_country =
        country;
    }


    const response = await api.get(
      "/discover/movie",
      {
        params,
      }
    );

    return response.data;

  } catch (error) {

    console.error(
      "Discover movies error:",
      error
    );

    return {
      results: [],
      page: 1,
      total_pages: 1,
    };
  }
}


/* =========================================================
   DISCOVER TV SHOWS
========================================================= */

export async function discoverShows({
  page = 1,
  genre = "",
  year = "",
  sort = "popularity.desc",
  provider = "",
  country = "",
} = {}) {

  try {

    const params = {
      page,
      sort_by: sort,
    };


    if (genre) {
      params.with_genres = genre;
    }


    if (year) {
      params.first_air_date_year =
        year;
    }


    if (provider) {

      params.with_watch_providers =
        provider;

      params.watch_region = "IN";
    }


    if (country) {

      params.with_origin_country =
        country;
    }


    const response = await api.get(
      "/discover/tv",
      {
        params,
      }
    );

    return response.data;

  } catch (error) {

    console.error(
      "Discover shows error:",
      error
    );

    return {
      results: [],
      page: 1,
      total_pages: 1,
    };
  }
}


/* =========================================================
   EXTERNAL RATINGS
========================================================= */

export async function getExternalRatings(id) {

  try {

    /*
      First get IMDb ID from TMDB
    */

    const response = await api.get(
      `/movie/${id}/external_ids`
    );


    const imdbId =
      response.data.imdb_id;


    if (!imdbId) {

      return {
        imdb: null,
        rottenTomatoes: null,
        rottenTomatoesAudience: null,
      };
    }


    const OMDB_KEY =
      import.meta.env.VITE_OMDB_API_KEY;


    if (!OMDB_KEY) {

      console.warn(
        "OMDb API key is missing."
      );

      return {
        imdb: null,
        rottenTomatoes: null,
        rottenTomatoesAudience: null,
      };
    }


    const omdbResponse =
      await axios.get(
        "https://www.omdbapi.com/",
        {
          params: {
            apikey: OMDB_KEY,
            i: imdbId,
          },
        }
      );


    const ratings =
      omdbResponse.data.Ratings || [];


    const imdbRating =
      ratings.find(
        (rating) =>
          rating.Source ===
          "Internet Movie Database"
      );


    const rottenTomatoesRating =
      ratings.find(
        (rating) =>
          rating.Source ===
          "Rotten Tomatoes"
      );


    return {

      imdb: imdbRating
        ? imdbRating.Value
        : null,

      rottenTomatoes:
        rottenTomatoesRating
          ? rottenTomatoesRating.Value
          : null,

      /*
        OMDb normally exposes
        Rotten Tomatoes critics score.

        Audience score is not
        consistently available.
      */

      rottenTomatoesAudience: null,
    };

  } catch (error) {

    console.error(
      "External ratings error:",
      error
    );

    return {
      imdb: null,
      rottenTomatoes: null,
      rottenTomatoesAudience: null,
    };
  }
}


/* =========================================================
   MOVIE COLLECTION
========================================================= */

export async function getMovieCollection(id) {

  try {

    const response = await api.get(
      `/collection/${id}`
    );

    return response.data;

  } catch (error) {

    console.error(
      "Collection error:",
      error
    );

    return null;
  }
}