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
  Sparkles,
  Menu,
  X,
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

  const { favorites } =
    useFavorites();

  const navigate =
    useNavigate();


  const [user, setUser] =
    useState(getUser());


  const [search, setSearch] =
    useState("");


  const [showSearch, setShowSearch] =
    useState(false);


  const [mobileMenuOpen, setMobileMenuOpen] =
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
  // ESCAPE
  // =====================================================

  useEffect(() => {

    function handleEscape(event) {

      if (event.key === "Escape") {

        setShowSearch(false);

        setMobileMenuOpen(false);

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

    setMobileMenuOpen(false);

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  function handleLogout() {

    logout();

    setUser(null);

    setMobileMenuOpen(false);

    navigate("/login");

  }


  // =====================================================
  // DESKTOP NAV LINK
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


  // =====================================================
  // MOBILE NAV LINK
  // =====================================================

  function mobileNavLink({
    isActive,
  }) {

    return `
      flex
      w-full
      items-center
      gap-4
      rounded-2xl
      px-4
      py-4
      text-[15px]
      font-medium
      transition
      duration-200
      ${
        isActive
          ? "bg-white text-black"
          : "text-white/70 hover:bg-white/[0.06] hover:text-white"
      }
    `;

  }


  // =====================================================
  // CLOSE MOBILE MENU
  // =====================================================

  function closeMobileMenu() {

    setMobileMenuOpen(false);

  }


  // =====================================================
  // PAGE
  // =====================================================

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
          px-4
          pt-4
          sm:px-6
          sm:pt-5
          lg:px-10
          lg:pt-6
        "
      >


        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          onClick={closeMobileMenu}
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
              h-10
              w-auto
              object-contain
              sm:h-12
              lg:h-14
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
              DESKTOP NAVBAR
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

                  <span
                    className="
                      relative
                      z-10
                      flex
                      items-center
                      gap-2
                    "
                  >

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

                  <span
                    className="
                      relative
                      z-10
                      flex
                      items-center
                      gap-2
                    "
                  >

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

                  <span
                    className="
                      relative
                      z-10
                      flex
                      items-center
                      gap-2
                    "
                  >

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

                  <span
                    className="
                      relative
                      z-10
                      flex
                      items-center
                      gap-2
                    "
                  >

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

                  <span
                    className="
                      relative
                      z-10
                      flex
                      items-center
                      gap-2
                    "
                  >

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

                      <span
                        className="
                          text-xs
                          opacity-60
                        "
                      >
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
            className="
              relative
            "
          >

            <button
              onClick={() =>
                setShowSearch(
                  (previous) =>
                    !previous
                )
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-black/40
                text-white
                shadow-[0_8px_30px_rgba(0,0,0,0.2)]
                backdrop-blur-2xl
                transition
                duration-300
                hover:scale-105
                hover:bg-white/10
                sm:h-12
                sm:w-12
              "
            >

              <Search
                size={18}
              />

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
                    top-10
                    z-[99999]
                    w-[calc(100vw-2rem)]
                    max-w-[380px]
                    sm:top-12
                    sm:w-[380px]
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
              USER
          ================================================= */}

          {user ? (

            <Link
              to="/profile"
              title="Profile"
              onClick={closeMobileMenu}
              className="
                hidden
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
                md:flex
              "
            >

              <User size={19} />

            </Link>

          ) : (

            <Link
              to="/login"
              title="Login"
              onClick={closeMobileMenu}
              className="
                hidden
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
                md:flex
              "
            >

              <User size={19} />

            </Link>

          )}


          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}

          <button
            onClick={() =>
              setMobileMenuOpen(
                (previous) =>
                  !previous
              )
            }
            aria-label={
              mobileMenuOpen
                ? "Close menu"
                : "Open menu"
            }
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-black/40
              text-white
              shadow-[0_8px_30px_rgba(0,0,0,0.2)]
              backdrop-blur-2xl
              transition
              duration-300
              hover:bg-white/10
              md:hidden
              sm:h-12
              sm:w-12
            "
          >

            <AnimatePresence
              mode="wait"
              initial={false}
            >

              {mobileMenuOpen ? (

                <motion.div
                  key="close"
                  initial={{
                    rotate: -90,
                    opacity: 0,
                  }}
                  animate={{
                    rotate: 0,
                    opacity: 1,
                  }}
                  exit={{
                    rotate: 90,
                    opacity: 0,
                  }}
                >

                  <X size={20} />

                </motion.div>

              ) : (

                <motion.div
                  key="menu"
                  initial={{
                    rotate: 90,
                    opacity: 0,
                  }}
                  animate={{
                    rotate: 0,
                    opacity: 1,
                  }}
                  exit={{
                    rotate: -90,
                    opacity: 0,
                  }}
                >

                  <Menu size={20} />

                </motion.div>

              )}

            </AnimatePresence>

          </button>

        </div>

      </div>


      {/* =================================================
          MOBILE MENU
      ================================================= */}

      <AnimatePresence>

        {mobileMenuOpen && (

          <motion.div
            initial={{
              opacity: 0,
              y: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -15,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              pointer-events-auto
              mx-4
              mt-3
              overflow-hidden
              rounded-[24px]
              border
              border-white/10
              bg-[#080808]/95
              p-2
              shadow-[0_20px_60px_rgba(0,0,0,0.55)]
              backdrop-blur-2xl
              sm:mx-6
              md:hidden
            "
          >

            {/* HOME */}

            <NavLink
              to="/"
              end
              onClick={closeMobileMenu}
              className={mobileNavLink}
            >

              <Home size={19} />

              <span>
                Home
              </span>

            </NavLink>


            {/* ABYSS */}

            <NavLink
              to="/abyss"
              onClick={closeMobileMenu}
              className={mobileNavLink}
            >

              <Sparkles size={19} />

              <span>
                Abyss
              </span>

            </NavLink>


            {/* MOVIES */}

            <NavLink
              to="/movies"
              onClick={closeMobileMenu}
              className={mobileNavLink}
            >

              <Film size={19} />

              <span>
                Movies
              </span>

            </NavLink>


            {/* SHOWS */}

            <NavLink
              to="/shows"
              onClick={closeMobileMenu}
              className={mobileNavLink}
            >

              <Tv size={19} />

              <span>
                Shows
              </span>

            </NavLink>


            {/* MY LIST */}

            <NavLink
              to="/favorites"
              onClick={closeMobileMenu}
              className={mobileNavLink}
            >

              <Heart
                size={19}
                fill="currentColor"
              />

              <span>
                My List
              </span>

              {favorites.length > 0 && (

                <span
                  className="
                    ml-auto
                    rounded-full
                    bg-white/10
                    px-2
                    py-1
                    text-xs
                  "
                >
                  {favorites.length}
                </span>

              )}

            </NavLink>


            {/* PROFILE / LOGIN */}

            {user ? (

              <NavLink
                to="/profile"
                onClick={closeMobileMenu}
                className={mobileNavLink}
              >

                <User size={19} />

                <span>
                  Profile
                </span>

              </NavLink>

            ) : (

              <NavLink
                to="/login"
                onClick={closeMobileMenu}
                className={mobileNavLink}
              >

                <User size={19} />

                <span>
                  Login
                </span>

              </NavLink>

            )}

          </motion.div>

        )}

      </AnimatePresence>

    </header>

  );

}


export default Navbar;