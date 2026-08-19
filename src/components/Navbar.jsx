import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Search,
  User,
  Heart,
  Home,
  Film,
  Tv,
  Settings,
  Sparkles,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getUser,
  logout,
} from "../utils/auth";

import logo from "../assets/logo.png";

import { useFavorites } from "../context/FavoritesContext";

import NavbarSearch from "./NavbarSearch";


function Navbar() {

  const { favorites } = useFavorites();

  const navigate = useNavigate();

  const [user, setUser] =
    useState(getUser());

  const [search, setSearch] =
    useState("");

  const [showSearch, setShowSearch] =
    useState(false);

  const searchContainerRef =
    useRef(null);


  // =====================================================
  // AUTH CHANGE
  // =====================================================

  useEffect(() => {

    const handleAuthChange = () => {
      setUser(getUser());
    };

    window.addEventListener(
      "storage",
      handleAuthChange
    );

    window.addEventListener(
      "focus",
      handleAuthChange
    );

    return () => {

      window.removeEventListener(
        "storage",
        handleAuthChange
      );

      window.removeEventListener(
        "focus",
        handleAuthChange
      );

    };

  }, []);


  // =====================================================
  // CLOSE SEARCH OUTSIDE
  // =====================================================

  useEffect(() => {

    function handleClick(event) {

      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(
          event.target
        )
      ) {
        setShowSearch(false);
      }

    }

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClick
      );

    };

  }, []);


  // =====================================================
  // ESCAPE SEARCH
  // =====================================================

  useEffect(() => {

    function handleEscape(event) {

      if (event.key === "Escape") {
        setShowSearch(false);
      }

    }

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {

      document.removeEventListener(
        "keydown",
        handleEscape
      );

    };

  }, []);


  // =====================================================
  // SEARCH
  // =====================================================

  function handleSearch() {

    if (!search.trim()) return;

    navigate(
      `/search?q=${encodeURIComponent(search)}`
    );

    setSearch("");

    setShowSearch(false);
  }


  // =====================================================
  // LOGOUT
  // =====================================================

  function handleLogout() {

    logout();

    setUser(null);

    navigate("/login");
  }


  // =====================================================
  // NAVIGATION LINK
  // =====================================================

  function navLink({
    isActive,
  }) {

    return `
      relative
      flex
      items-center
      gap-2
      rounded-full
      px-5
      py-3
      text-sm
      font-medium
      transition-colors
      duration-300
      ${
        isActive
          ? "text-black"
          : "text-white/65 hover:text-white"
      }
    `;
  }


  return (

    <header
      className="
        pointer-events-none
        fixed
        left-0
        top-0
        z-[9999]
        w-full
      "
    >

      {/* =================================================
          NAVBAR CONTAINER
      ================================================= */}

      <div
        className="
          flex
          w-full
          items-center
          justify-between
          px-6
          pt-6
          sm:px-8
          lg:px-10
        "
      >

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          className="
            pointer-events-auto
            flex
            items-center
            transition
            duration-300
            hover:scale-105
          "
        >

          <img
            src={logo}
            alt="WatchNow"
            className="
              h-12
              w-auto
              object-contain
              sm:h-14
            "
          />

        </Link>


        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div
          className="
            pointer-events-auto
            flex
            items-center
            gap-2
          "
        >

          {/* =================================================
              MAIN GLASS NAVBAR
          ================================================= */}

          <nav
            className="
              hidden
              items-center
              gap-1
              rounded-full
              border
              border-white/10
              bg-black/30
              p-1
              shadow-[0_8px_35px_rgba(0,0,0,0.25)]
              backdrop-blur-2xl
              md:flex
            "
          >

            {/* HOME */}

            <NavLink
              to="/"
              end
              className={navLink}
            >

              {({
                isActive,
              }) => (

                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="
                        absolute
                        inset-0
                        rounded-full
                        bg-white
                      "
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-2">
                    <Home size={16} />

                    <span>
                      Home
                    </span>
                  </span>
                </>

              )}

            </NavLink>
            {/* ABYSS */}
<NavLink
  to="/abyss"
  className={navLink}
>
  {({ isActive }) => (
    <>
      {isActive && (
        <motion.div
          layoutId="activeNav"
          className="
            absolute
            inset-0
            rounded-full
            bg-white
          "
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        />
      )}

      <span className="relative z-10 flex items-center gap-2">

        <Sparkles size={16} />

        <span>
          Abyss
        </span>

      </span>
    </>
  )}
</NavLink>

            {/* MOVIES */}

            <NavLink
              to="/movies"
              className={navLink}
            >

              {({
                isActive,
              }) => (

                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="
                        absolute
                        inset-0
                        rounded-full
                        bg-white
                      "
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-2">
                    <Film size={16} />

                    <span>
                      Movies
                    </span>
                  </span>
                </>

              )}

            </NavLink>


            {/* SHOWS */}

            <NavLink
              to="/shows"
              className={navLink}
            >

              {({
                isActive,
              }) => (

                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="
                        absolute
                        inset-0
                        rounded-full
                        bg-white
                      "
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-2">
                    <Tv size={16} />

                    <span>
                      Shows
                    </span>
                  </span>
                </>

              )}

            </NavLink>


            {/* MY LIST */}

            <NavLink
              to="/favorites"
              className={navLink}
            >

              {({
                isActive,
              }) => (

                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="
                        absolute
                        inset-0
                        rounded-full
                        bg-white
                      "
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-2">

                    <Heart
                      size={16}
                      fill={
                        isActive
                          ? "currentColor"
                          : "none"
                      }
                    />

                    <span>
                      My List
                    </span>

                    {favorites.length > 0 && (
                      <span className="text-xs opacity-60">
                        {favorites.length}
                      </span>
                    )}

                  </span>

                </>

              )}

            </NavLink>

          </nav>


          {/* =================================================
              SEARCH
          ================================================= */}

          <div
            ref={searchContainerRef}
            className="relative"
          >

            <button
              onClick={() =>
                setShowSearch(
                  (previous) => !previous
                )
              }
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-black/30
                text-white
                shadow-[0_8px_30px_rgba(0,0,0,0.2)]
                backdrop-blur-2xl
                transition
                duration-300
                hover:scale-105
                hover:bg-white/10
              "
            >

              <Search size={19} />

            </button>


            {/* SEARCH DROPDOWN */}

            <AnimatePresence>

              {showSearch && (

                <motion.div
                  initial={{
                    opacity: 0,
                    y: -8,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    y: 8,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                    scale: 0.96,
                  }}
                  className="
                    absolute
                    right-0
                    top-12
                    z-[99999]
                  "
                >

                  <NavbarSearch
                    search={search}
                    setSearch={setSearch}
                    handleSearch={handleSearch}
                  />

                </motion.div>

              )}

            </AnimatePresence>

          </div>


          {/* =================================================
              USER / SETTINGS
          ================================================= */}

          {user ? (

            <div className="flex items-center gap-2">

              <Link
                to="/profile"
                title="Profile"
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-black/30
                  text-white
                  shadow-[0_8px_30px_rgba(0,0,0,0.2)]
                  backdrop-blur-2xl
                  transition
                  duration-300
                  hover:scale-105
                  hover:bg-white/10
                "
              >

                <User size={19} />

              </Link>

            </div>

          ) : (

            <Link
              to="/login"
              title="Login"
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-black/30
                text-white
                shadow-[0_8px_30px_rgba(0,0,0,0.2)]
                backdrop-blur-2xl
                transition
                duration-300
                hover:scale-105
                hover:bg-white/10
              "
            >

              <User size={19} />

            </Link>

          )}

        </div>

      </div>

    </header>

  );
}

export default Navbar;