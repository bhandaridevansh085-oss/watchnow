import {
  getSimilarMovies,
  getSimilarTV,
} from "./movieApi";


// =========================================================
// ABYSS ENGINE
// =========================================================
//
// Takes the user's complete favorites array.
//
// Example:
//
// generateAbyssRecommendations([
//   favorite1,
//   favorite2,
//   favorite3
// ])
//
// =========================================================

export async function generateAbyssRecommendations(
  favorites
) {

  console.log(
    "🌌 ABYSS:",
    favorites
  );


  // =======================================================
  // VALIDATE
  // =======================================================

  if (
    !Array.isArray(favorites) ||
    favorites.length === 0
  ) {

    return [];

  }


  // =======================================================
  // GET RECOMMENDATIONS FROM ALL FAVORITES
  // =======================================================

  const recommendationResults =
    await Promise.all(

      favorites.map(
        async (favorite) => {

          const results =
            await getRecommendations(
              favorite
            );

          return {
            favorite,
            results,
          };

        }
      )

    );


  // =======================================================
  // CREATE CANDIDATE MAP
  // =======================================================

  const candidates =
    new Map();


  // =======================================================
  // ADD ALL RECOMMENDATIONS
  // =======================================================

  recommendationResults.forEach(
    ({
      favorite,
      results,
    }) => {

      results.forEach(
        (item, index) => {

          addCandidate(
            candidates,
            item,
            favorite,
            index
          );

        }
      );

    }
  );


  // =======================================================
  // REMOVE USER'S EXISTING FAVORITES
  // =======================================================

  favorites.forEach(
    (favorite) => {

      const type =
        favorite.type;


      const id =
        favorite.movieId;


      if (
        type &&
        id
      ) {

        candidates.delete(
          `${type}-${id}`
        );

      }

    }
  );


  // =======================================================
  // CONVERT MAP → ARRAY
  // =======================================================

  const results =
    Array.from(
      candidates.values()
    );


  // =======================================================
  // CALCULATE SCORE
  // =======================================================

  results.forEach(
    (candidate) => {

      candidate.score =
        calculateScore(
          candidate
        );

    }
  );


  // =======================================================
  // SORT
  // =======================================================

  results.sort(
    (a, b) =>
      b.score - a.score
  );


  // =======================================================
  // FINAL RESULTS
  // =======================================================

  const finalResults =
    results.slice(
      0,
      40
    );


  console.log(
    "🌌 ABYSS FINAL:",
    finalResults
  );


  return finalResults;
}


// =========================================================
// GET RECOMMENDATIONS
// =========================================================

async function getRecommendations(
  item
) {

  try {

    // =====================================================
    // VALIDATE FAVORITE
    // =====================================================

    if (
      !item ||
      !item.movieId ||
      !item.type
    ) {

      console.warn(
        "🌌 ABYSS: Invalid favorite:",
        item
      );

      return [];

    }


    // =====================================================
    // TV
    // =====================================================

    if (
      item.type === "tv"
    ) {

      const results =
        await getSimilarTV(
          item.movieId
        );


      return normalizeResults(
        results,
        "tv"
      );

    }


    // =====================================================
    // MOVIE
    // =====================================================

    const results =
      await getSimilarMovies(
        item.movieId
      );


    return normalizeResults(
      results,
      "movie"
    );


  } catch (error) {

    console.error(
      "🌌 ABYSS recommendation error:",
      error
    );

    return [];

  }

}


// =========================================================
// NORMALIZE RESULTS
// =========================================================

function normalizeResults(
  results,
  type
) {

  if (
    !Array.isArray(results)
  ) {

    return [];

  }


  return results

    .filter(
      (item) =>
        item &&
        item.id
    )

    .map(
      (item) => ({

        ...item,

        type:
          item.media_type === "tv"
            ? "tv"
            : item.media_type === "movie"
              ? "movie"
              : type,

      })
    );

}


// =========================================================
// ADD CANDIDATE
// =========================================================

function addCandidate(
  map,
  item,
  source,
  position
) {

  if (
    !item ||
    !item.id
  ) {

    return;

  }


  // =======================================================
  // TYPE
  // =======================================================

  const type =
    item.type ||
    (
      item.media_type === "tv"
        ? "tv"
        : "movie"
    );


  // =======================================================
  // KEY
  // =======================================================

  const key =
    `${type}-${item.id}`;


  // =======================================================
  // INITIAL CANDIDATE
  // =======================================================

  if (
    !map.has(key)
  ) {

    map.set(
      key,
      {

        ...item,

        type,

        score: 0,

        appearances: 0,

        bestPosition:
          position,

        sourceTypes: [],

        sourceFavorites: [],

      }
    );

  }


  const candidate =
    map.get(key);


  // =======================================================
  // APPEARANCES
  // =======================================================

  candidate.appearances += 1;


  // =======================================================
  // BEST TMDB POSITION
  // =======================================================

  candidate.bestPosition =
    Math.min(
      candidate.bestPosition,
      position
    );


  // =======================================================
  // SOURCE TYPE
  // =======================================================

  if (
    source.type &&
    !candidate.sourceTypes.includes(
      source.type
    )
  ) {

    candidate.sourceTypes.push(
      source.type
    );

  }


  // =======================================================
  // SOURCE FAVORITE
  // =======================================================

  const sourceKey =
    `${source.type}-${source.movieId}`;


  if (
    !candidate.sourceFavorites.includes(
      sourceKey
    )
  ) {

    candidate.sourceFavorites.push(
      sourceKey
    );

  }

}


// =========================================================
// CALCULATE ABYSS SCORE
// =========================================================

function calculateScore(
  candidate
) {

  let score = 0;


  // =======================================================
  // APPEARS MULTIPLE TIMES
  // =======================================================

  if (
    candidate.appearances >= 2
  ) {

    score += 100;

  } else {

    score += 35;

  }


  // =======================================================
  // ADDITIONAL APPEARANCES
  // =======================================================

  score +=
    candidate.appearances *
    20;


  // =======================================================
  // TMDB POSITION
  // =======================================================

  if (
    candidate.bestPosition < 5
  ) {

    score += 30;

  } else if (
    candidate.bestPosition < 10
  ) {

    score += 20;

  } else if (
    candidate.bestPosition < 20
  ) {

    score += 10;

  }


  // =======================================================
  // RATING
  // =======================================================

  const rating =
    Number(
      candidate.vote_average ||
      0
    );


  score +=
    Math.min(
      rating * 5,
      50
    );


  // =======================================================
  // POPULARITY
  // =======================================================

  const popularity =
    Number(
      candidate.popularity ||
      0
    );


  score +=
    Math.min(
      popularity / 10,
      20
    );


  return score;

}