import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  generateAbyssRecommendations,
} from "../services/abyssEngine";


const FavoritesContext =
  createContext();


const API_URL =
  `${import.meta.env.VITE_API_URL}/api/favorites`;


// =========================================================
// GET VALID FAVORITE TYPE
// =========================================================

function getFavoriteType(item) {

  const type =
    item?.type ||
    item?.media_type;

  if (
    type === "movie" ||
    type === "tv"
  ) {
    return type;
  }

  return null;
}


// =========================================================
// PROVIDER
// =========================================================

export function FavoritesProvider({
  children,
}) {

  const [favorites, setFavorites] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // =========================================================
  // ABYSS
  // =========================================================

  const [
    abyssRecommendations,
    setAbyssRecommendations,
  ] = useState([]);

  const [
    abyssLoading,
    setAbyssLoading,
  ] = useState(false);


  // =========================================================
  // FETCH FAVORITES
  // =========================================================

  const fetchFavorites =
    useCallback(
      async () => {

        setLoading(true);

        try {

          const token =
            localStorage.getItem(
              "token"
            );


          if (!token) {

            setFavorites([]);

            setAbyssRecommendations([]);

            return;

          }


          const response =
            await fetch(
              API_URL,
              {
                method: "GET",

                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );


          const contentType =
            response.headers.get(
              "content-type"
            ) || "";


          let data = null;


          if (
            contentType.includes(
              "application/json"
            )
          ) {

            data =
              await response.json();

          } else {

            const text =
              await response.text();

            console.error(
              "Favorites server returned non-JSON:",
              text
            );

          }


          if (!response.ok) {

            throw new Error(
              data?.message ||
              `Failed to fetch favorites (${response.status})`
            );

          }


          setFavorites(
            Array.isArray(data)
              ? data
              : []
          );


        } catch (error) {

          console.error(
            "Failed to fetch favorites:",
            error
          );

          setFavorites([]);

        } finally {

          setLoading(false);

        }

      },
      []
    );


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    fetchFavorites();

  }, [
    fetchFavorites,
  ]);


  // =========================================================
  // AUTH CHANGE
  // =========================================================

  useEffect(() => {

    function handleAuthChange() {

      setFavorites([]);

      setAbyssRecommendations([]);

      fetchFavorites();

    }


    window.addEventListener(
      "auth-change",
      handleAuthChange
    );


    return () => {

      window.removeEventListener(
        "auth-change",
        handleAuthChange
      );

    };

  }, [
    fetchFavorites,
  ]);


  // =========================================================
  // ABYSS ENGINE
  // =========================================================

  useEffect(() => {

    let cancelled = false;


    async function updateAbyss() {

      if (!favorites.length) {

        setAbyssRecommendations([]);

        setAbyssLoading(false);

        return;

      }


      setAbyssLoading(true);


      try {

        const recommendations =
          await generateAbyssRecommendations(
            favorites
          );


        if (!cancelled) {

          setAbyssRecommendations(
            Array.isArray(
              recommendations
            )
              ? recommendations
              : []
          );

        }

      } catch (error) {

        console.error(
          "ABYSS failed:",
          error
        );


        if (!cancelled) {

          setAbyssRecommendations([]);

        }

      } finally {

        if (!cancelled) {

          setAbyssLoading(false);

        }

      }

    }


    updateAbyss();


    return () => {

      cancelled = true;

    };

  }, [
    favorites,
  ]);


  // =========================================================
  // ADD FAVORITE
  // =========================================================

  async function addFavorite(item) {

    try {

      const token =
        localStorage.getItem(
          "token"
        );


      if (!token) {

        console.log(
          "User is not logged in"
        );

        return;

      }


      const type =
        getFavoriteType(item);


      if (
        type !== "movie" &&
        type !== "tv"
      ) {

        console.error(
          "Invalid favorite type:",
          item
        );

        return;

      }


      const response =
        await fetch(
          API_URL,
          {
            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

            },

            body:
              JSON.stringify({

                movieId:
                  item.id,

                title:
                  item.title ||
                  item.name ||
                  "",

                poster:
                  item.poster ||
                  item.poster_path ||
                  null,

                year:
                  item.year ||
                  (
                    item.release_date ||
                    item.first_air_date
                      ? (
                          item.release_date ||
                          item.first_air_date
                        ).slice(0, 4)
                      : ""
                  ),

                rating:
                  Number(
                    item.rating ??
                    item.vote_average ??
                    0
                  ),

                type,

              }),

          }
        );


      const contentType =
        response.headers.get(
          "content-type"
        ) || "";


      let data = null;


      if (
        contentType.includes(
          "application/json"
        )
      ) {

        data =
          await response.json();

      } else {

        const text =
          await response.text();

        console.error(
          "Add favorite returned non-JSON:",
          text
        );

      }


      if (!response.ok) {

        console.error(
          data?.message ||
          `Failed to add favorite (${response.status})`
        );

        return;

      }


      setFavorites(
        (previous) => {

          const exists =
            previous.some(
              (favorite) =>
                String(
                  favorite.movieId
                ) ===
                  String(
                    data.movieId
                  ) &&
                favorite.type ===
                  data.type
            );


          if (exists) {

            return previous;

          }


          return [
            ...previous,
            data,
          ];

        }
      );


    } catch (error) {

      console.error(
        "Failed to add favorite:",
        error
      );

    }

  }


  // =========================================================
  // REMOVE FAVORITE
  // =========================================================

  async function removeFavorite(
    id,
    type
  ) {

    try {

      const token =
        localStorage.getItem(
          "token"
        );


      if (!token) {

        return;

      }


      const normalizedType =
        type === "movie" ||
        type === "tv"
          ? type
          : null;


      if (!normalizedType) {

        console.error(
          "Type must be movie or tv:",
          type
        );

        return;

      }


      // =====================================================
      // DELETE REQUEST
      // =====================================================

      const response =
        await fetch(
          `${API_URL}/${id}/${normalizedType}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      // =====================================================
      // SAFELY READ RESPONSE
      // =====================================================

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";


      let data = null;


      if (
        contentType.includes(
          "application/json"
        )
      ) {

        data =
          await response.json();

      } else {

        const text =
          await response.text();

        console.error(
          "Remove favorite returned non-JSON:",
          text
        );

      }


      // =====================================================
      // HANDLE ERROR
      // =====================================================

      if (!response.ok) {

        console.error(
          data?.message ||
          `Failed to remove favorite (${response.status})`
        );

        return;

      }


      // =====================================================
      // REMOVE FROM STATE
      // =====================================================

      setFavorites(
        (previous) =>
          previous.filter(
            (favorite) =>
              !(
                String(
                  favorite.movieId
                ) ===
                  String(id) &&
                favorite.type ===
                  normalizedType
              )
          )
      );


    } catch (error) {

      console.error(
        "Failed to remove favorite:",
        error
      );

    }

  }


  // =========================================================
  // CHECK FAVORITE
  // =========================================================

  function isFavorite(
    id,
    type
  ) {

    if (
      type !== "movie" &&
      type !== "tv"
    ) {

      return false;

    }


    return favorites.some(
      (favorite) =>
        String(
          favorite.movieId
        ) === String(id) &&
        favorite.type === type
    );

  }


  // =========================================================
  // PROVIDER
  // =========================================================

  return (

    <FavoritesContext.Provider
      value={{

        favorites,

        loading,

        addFavorite,

        removeFavorite,

        isFavorite,

        fetchFavorites,

        abyssRecommendations,

        abyssLoading,

      }}
    >

      {children}

    </FavoritesContext.Provider>

  );

}


// ===========================================================
// HOOK
// ===========================================================

export function useFavorites() {

  return useContext(
    FavoritesContext
  );

}