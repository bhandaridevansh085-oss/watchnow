import {
  getSimilarMovies,
  getSimilarTV,
} from "./movieApi";


// =========================================================
// ABYSS ENGINE
// =========================================================

export async function generateAbyssRecommendations(
  first,
  second
) {

  console.log(
    "🌌 ABYSS:",
    first,
    second
  );


  if (!first || !second) {
    return [];
  }


  // =======================================================
  // GET RECOMMENDATIONS FROM BOTH
  // =======================================================

  const [
    firstResults,
    secondResults,
  ] = await Promise.all([

    getRecommendations(first),

    getRecommendations(second),

  ]);


  console.log(
    "🌌 First recommendations:",
    firstResults.length
  );

  console.log(
    "🌌 Second recommendations:",
    secondResults.length
  );


  // =======================================================
  // CREATE CANDIDATE MAP
  // =======================================================

  const candidates = new Map();


  // -------------------------------------------------------
  // ADD FIRST RESULTS
  // -------------------------------------------------------

  firstResults.forEach(
    (item, index) => {

      addCandidate(
        candidates,
        item,
        first,
        1,
        index
      );

    }
  );


  // -------------------------------------------------------
  // ADD SECOND RESULTS
  // -------------------------------------------------------

  secondResults.forEach(
    (item, index) => {

      addCandidate(
        candidates,
        item,
        second,
        2,
        index
      );

    }
  );


  // =======================================================
  // REMOVE SELECTED TITLES
  // =======================================================

  candidates.delete(
    `${first.type}-${first.id}`
  );

  candidates.delete(
    `${second.type}-${second.id}`
  );


  // =======================================================
  // SCORE
  // =======================================================

  const results =
    Array.from(
      candidates.values()
    );


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
  // FINAL
  // =======================================================

  const finalResults =
    results.slice(0, 40);


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

    if (item.type === "tv") {

      const results =
        await getSimilarTV(
          item.id
        );

      return normalizeResults(
        results,
        "tv"
      );

    }


    const results =
      await getSimilarMovies(
        item.id
      );


    return normalizeResults(
      results,
      "movie"
    );


  } catch (error) {

    console.error(
      "ABYSS recommendation error:",
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

  if (!Array.isArray(results)) {
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
  sourceNumber,
  position
) {

  const type =
    item.type ||
    (
      item.media_type === "tv"
        ? "tv"
        : "movie"
    );


  const key =
    `${type}-${item.id}`;


  // =======================================================
  // INITIAL CANDIDATE
  // =======================================================

  if (!map.has(key)) {

    map.set(
      key,
      {

        ...item,

        type,

        score: 0,

        fromFirst: false,

        fromSecond: false,

        appearances: 0,

        bestPosition: position,

        sourceTypes: [],

      }
    );

  }


  const candidate =
    map.get(key);


  // =======================================================
  // APPEARS IN FIRST
  // =======================================================

  if (sourceNumber === 1) {

    candidate.fromFirst = true;

  }


  // =======================================================
  // APPEARS IN SECOND
  // =======================================================

  if (sourceNumber === 2) {

    candidate.fromSecond = true;

  }


  candidate.appearances += 1;


  // Better position = stronger
  // recommendation from TMDB.

  candidate.bestPosition =
    Math.min(
      candidate.bestPosition,
      position
    );


  // =======================================================
  // SOURCE TYPE
  // =======================================================

  if (
    !candidate.sourceTypes.includes(
      source.type
    )
  ) {

    candidate.sourceTypes.push(
      source.type
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
  // APPEARS IN BOTH
  // =======================================================

  if (
    candidate.fromFirst &&
    candidate.fromSecond
  ) {

    // VERY strong signal

    score += 100;

  } else {

    // Still useful if only one
    // recommendation list contains it.

    score += 35;

  }


  // =======================================================
  // MULTIPLE APPEARANCES
  // =======================================================

  score +=
    candidate.appearances * 20;


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
      candidate.vote_average || 0
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
      candidate.popularity || 0
    );


  score +=
    Math.min(
      popularity / 10,
      20
    );


  return score;

}