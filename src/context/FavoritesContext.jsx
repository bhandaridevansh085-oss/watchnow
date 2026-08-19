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


const FavoritesContext = createContext();

const API_URL =
  `${import.meta.env.VITE_API_URL}/api/favorites`;

export function FavoritesProvider({ children }) {

  const [favorites, setFavorites] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =========================================================
  // ABYSS RECOMMENDATIONS
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
  // GET FAVORITES FROM MONGODB
  // =========================================================

  const fetchFavorites = useCallback(
    async () => {

      setLoading(true);

      try {

        const token =
          localStorage.getItem("token");


        // No logged-in user

        if (!token) {

          setFavorites([]);

          return;

        }


        const response = await fetch(
          API_URL,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to fetch favorites"
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

  }, [fetchFavorites]);


  // =========================================================
  // AUTH CHANGE
  // =========================================================

  useEffect(() => {

    function handleAuthChange() {

      /*
        Clear old user's favorites
        immediately before loading
        the new user's favorites.
      */

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

  }, [fetchFavorites]);


  // =========================================================
  // ABYSS ENGINE
  // =========================================================

  useEffect(() => {

    let cancelled = false;


    async function updateAbyss() {

      // No favorites = no recommendations

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

  }, [favorites]);


  // =========================================================
  // ADD FAVORITE
  // =========================================================

  async function addFavorite(item) {

    try {

      const token =
        localStorage.getItem("token");


      if (!token) {

        console.log(
          "User is not logged in"
        );

        return;

      }


      const response = await fetch(
        API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({

            movieId: item.id,

            title: item.title,

            poster: item.poster,

            year: item.year,

            rating: item.rating,

            type: item.type,

          }),
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        console.error(
          data.message ||
          "Failed to add favorite"
        );

        return;

      }


      // =====================================================
      // ADD TO CURRENT USER'S STATE
      // =====================================================

      setFavorites((prev) => {

        const exists = prev.some(
          (favorite) =>
            String(
              favorite.movieId
            ) ===
              String(data.movieId) &&
            favorite.type === data.type
        );


        if (exists) {

          return prev;

        }


        return [
          ...prev,
          data,
        ];

      });


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
        localStorage.getItem("token");


      if (!token) {

        return;

      }


      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        console.error(
          data.message ||
          "Failed to remove favorite"
        );

        return;

      }


      // =====================================================
      // REMOVE FROM CURRENT USER'S STATE
      // =====================================================

      setFavorites((prev) =>
        prev.filter(
          (favorite) =>
            !(
              String(
                favorite.movieId
              ) === String(id) &&
              favorite.type === type
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

    return favorites.some(
      (favorite) =>
        String(
          favorite.movieId
        ) === String(id) &&
        favorite.type === type
    );

  }


  // =========================================================
  // CONTEXT
  // =========================================================

  return (

    <FavoritesContext.Provider
      value={{

        // Favorites
        favorites,

        loading,

        addFavorite,

        removeFavorite,

        isFavorite,

        fetchFavorites,


        // ABYSS
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