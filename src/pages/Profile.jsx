import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Heart,
  Lock,
  LogOut,
  Pencil,
  Save,
  X,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import { getUser, logout } from "../utils/auth";


// =========================================================
// API URL
// =========================================================

const API_URL =
  import.meta.env.VITE_API_URL;


function Profile() {

  const navigate = useNavigate();

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  const [editingName, setEditingName] =
    useState(false);

  const [name, setName] =
    useState("");


  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");


  const [favoriteCount, setFavoriteCount] =
    useState(0);


  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  // =========================================================
  // LOAD PROFILE
  // =========================================================

  useEffect(() => {

    async function loadProfile() {

      try {

        const storedUser =
          getUser();


        if (!storedUser) {

          navigate("/login");

          return;

        }


        const token =
          localStorage.getItem("token");


        const response =
          await fetch(
            `${API_URL}/api/auth/profile`,
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
            "Failed to load profile"
          );

        }


        setUser(data.user);

        setName(data.user.name);


      } catch (err) {

        setError(
          err.message
        );


      } finally {

        setLoading(false);

      }

    }


    loadProfile();

  }, [navigate]);


  // =========================================================
  // LOAD FAVORITES
  // =========================================================

  useEffect(() => {

    async function loadFavorites() {

      try {

        const token =
          localStorage.getItem("token");


        if (!token) return;


        const response =
          await fetch(
            `${API_URL}/api/favorites`,
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


        if (
          response.ok &&
          Array.isArray(data)
        ) {

          setFavoriteCount(
            data.length
          );

        }


      } catch (err) {

        console.error(
          "Failed to load favorites:",
          err
        );

      }

    }


    loadFavorites();

  }, []);


  // =========================================================
  // UPDATE NAME
  // =========================================================

  async function handleUpdateName() {

    setMessage("");

    setError("");


    if (!name.trim()) {

      setError(
        "Name cannot be empty"
      );

      return;

    }


    try {

      const token =
        localStorage.getItem("token");


      const response =
        await fetch(
          `${API_URL}/api/auth/profile`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              name: name.trim(),
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to update name"
        );

      }


      setUser(data.user);

      setName(data.user.name);

      setEditingName(false);


      setMessage(
        "Name updated successfully"
      );


    } catch (err) {

      setError(
        err.message
      );

    }

  }


  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  async function handleChangePassword() {

    setMessage("");

    setError("");


    if (
      !currentPassword ||
      !newPassword
    ) {

      setError(
        "Please enter both passwords"
      );

      return;

    }


    if (
      newPassword.length < 6
    ) {

      setError(
        "New password must be at least 6 characters"
      );

      return;

    }


    try {

      const token =
        localStorage.getItem("token");


      const response =
        await fetch(
          `${API_URL}/api/auth/change-password`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              currentPassword,
              newPassword,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to change password"
        );

      }


      setCurrentPassword("");

      setNewPassword("");


      setMessage(
        "Password changed successfully"
      );


    } catch (err) {

      setError(
        err.message
      );

    }

  }


  // =========================================================
  // LOGOUT
  // =========================================================

  function handleLogout() {

    logout();

    navigate("/login");

  }


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#050505]
          text-white
        "
      >

        <div className="text-center">

          <div
            className="
              mx-auto
              mb-4
              h-10
              w-10
              animate-spin
              rounded-full
              border-2
              border-white/10
              border-t-white
            "
          />

          <p
            className="
              text-sm
              text-zinc-400
            "
          >
            Loading profile...
          </p>

        </div>

      </div>

    );

  }


  // =========================================================
  // USER INITIAL
  // =========================================================

  const initial =
    user?.name
      ?.charAt(0)
      ?.toUpperCase() ||
    "U";


  // =========================================================
  // PAGE
  // =========================================================

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


      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
        "
      >

        <div
          className="
            absolute
            left-1/2
            top-0
            h-[600px]
            w-[900px]
            -translate-x-1/2
            rounded-full
            bg-blue-500/[0.08]
            blur-[160px]
          "
        />

        <div
          className="
            absolute
            -left-40
            top-[500px]
            h-[500px]
            w-[500px]
            rounded-full
            bg-purple-500/[0.05]
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            -right-40
            top-[700px]
            h-[500px]
            w-[500px]
            rounded-full
            bg-cyan-500/[0.04]
            blur-[150px]
          "
        />

      </div>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="
          relative
          mx-auto
          max-w-6xl
          px-5
          pb-24
          pt-24
          sm:px-8
          sm:pt-28
          lg:px-10
          lg:pt-28
        "
      >


        {/* ===================================================
            HEADER
        =================================================== */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-white/[0.08]
            bg-white/[0.035]
            backdrop-blur-2xl
          "
        >

          <div
            className="
              absolute
              right-[-100px]
              top-[-150px]
              h-[400px]
              w-[400px]
              rounded-full
              bg-blue-500/[0.08]
              blur-[120px]
            "
          />


          <div
            className="
              relative
              p-7
              sm:p-10
            "
          >

            <div
              className="
                flex
                flex-col
                gap-8
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >


              {/* PROFILE */}

              <div
                className="
                  flex
                  items-center
                  gap-6
                "
              >

                <div
                  className="
                    flex
                    h-24
                    w-24
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-gradient-to-br
                    from-zinc-700
                    to-zinc-950
                    text-4xl
                    font-black
                    shadow-2xl
                    sm:h-28
                    sm:w-28
                    sm:text-5xl
                  "
                >

                  {initial}

                </div>


                <div>

                  <p
                    className="
                      mb-2
                      text-sm
                      font-medium
                      uppercase
                      tracking-[0.2em]
                      text-zinc-500
                    "
                  >
                    Your Account
                  </p>


                  <h1
                    className="
                      text-3xl
                      font-black
                      tracking-tight
                      sm:text-5xl
                    "
                  >
                    {user?.name}
                  </h1>


                  <div
                    className="
                      mt-3
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-zinc-400
                    "
                  >

                    <Mail size={15} />

                    {user?.email}

                  </div>

                </div>

              </div>


              {/* EDIT */}

              {!editingName && (

                <button
                  onClick={() => {

                    setEditingName(true);

                    setMessage("");

                    setError("");

                  }}
                  className="
                    flex
                    w-fit
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.06]
                    px-5
                    py-3
                    text-sm
                    font-medium
                    text-zinc-200
                    backdrop-blur-xl
                    transition
                    hover:bg-white/[0.12]
                  "
                >

                  <Pencil size={16} />

                  Edit Profile

                </button>

              )}

            </div>


            {/* EDIT NAME */}

            {editingName && (

              <div
                className="
                  mt-8
                  border-t
                  border-white/[0.06]
                  pt-7
                "
              >

                <p
                  className="
                    mb-3
                    text-sm
                    text-zinc-400
                  "
                >
                  Change your name
                </p>


                <div
                  className="
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                  "
                >

                  <input
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    autoFocus
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-black/30
                      px-4
                      py-3
                      text-white
                      outline-none
                      placeholder:text-zinc-600
                      focus:border-white/30
                      sm:max-w-md
                    "
                  />


                  <button
                    onClick={
                      handleUpdateName
                    }
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-white
                      px-5
                      py-3
                      font-semibold
                      text-black
                      transition
                      hover:bg-zinc-200
                    "
                  >

                    <Save size={17} />

                    Save

                  </button>


                  <button
                    onClick={() => {

                      setEditingName(false);

                      setName(
                        user.name
                      );

                    }}
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.05]
                      px-5
                      py-3
                      text-zinc-300
                      transition
                      hover:bg-white/[0.1]
                    "
                  >

                    <X size={17} />

                    Cancel

                  </button>

                </div>

              </div>

            )}

          </div>

        </section>


        {/* ===================================================
            MESSAGES
        =================================================== */}

        {message && (

          <div
            className="
              mt-5
              rounded-2xl
              border
              border-emerald-500/20
              bg-emerald-500/[0.08]
              px-5
              py-4
              text-sm
              text-emerald-400
            "
          >

            {message}

          </div>

        )}


        {error && (

          <div
            className="
              mt-5
              rounded-2xl
              border
              border-red-500/20
              bg-red-500/[0.08]
              px-5
              py-4
              text-sm
              text-red-400
            "
          >

            {error}

          </div>

        )}


        {/* ===================================================
            STATS
        =================================================== */}

        <section
          className="
            mt-6
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
          "
        >


          {/* FAVORITES */}

          <button
            onClick={() =>
              navigate("/favorites")
            }
            className="
              group
              relative
              overflow-hidden
              rounded-[24px]
              border
              border-white/[0.08]
              bg-white/[0.035]
              p-6
              text-left
              backdrop-blur-2xl
              transition
              duration-300
              hover:-translate-y-1
              hover:bg-white/[0.06]
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-sm
                    text-zinc-500
                  "
                >
                  My List
                </p>


                <p
                  className="
                    mt-2
                    text-4xl
                    font-black
                  "
                >
                  {favoriteCount}
                </p>


                <p
                  className="
                    mt-1
                    text-sm
                    text-zinc-400
                  "
                >
                  saved movies & shows
                </p>

              </div>


              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-red-500/10
                  text-red-400
                "
              >

                <Heart
                  size={25}
                  fill="currentColor"
                />

              </div>

            </div>


            <div
              className="
                mt-6
                flex
                items-center
                gap-1
                text-sm
                text-zinc-500
                transition
                group-hover:text-white
              "
            >

              View My List

              <ChevronRight
                size={16}
                className="
                  transition
                  group-hover:translate-x-1
                "
              />

            </div>

          </button>


          {/* ACCOUNT STATUS */}

          <div
            className="
              rounded-[24px]
              border
              border-white/[0.08]
              bg-white/[0.035]
              p-6
              backdrop-blur-2xl
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-sm
                    text-zinc-500
                  "
                >
                  Account Status
                </p>


                <p
                  className="
                    mt-2
                    text-xl
                    font-bold
                  "
                >
                  Active
                </p>


                <p
                  className="
                    mt-1
                    text-sm
                    text-zinc-400
                  "
                >
                  Your account is protected
                </p>

              </div>


              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-emerald-500/10
                  text-emerald-400
                "
              >

                <ShieldCheck
                  size={26}
                />

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            ACCOUNT INFORMATION
        =================================================== */}

        <section
          className="
            mt-6
            rounded-[24px]
            border
            border-white/[0.08]
            bg-white/[0.035]
            p-6
            backdrop-blur-2xl
            sm:p-8
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-white/[0.06]
              "
            >

              <User size={20} />

            </div>


            <div>

              <h2
                className="
                  text-xl
                  font-bold
                "
              >
                Account Information
              </h2>


              <p
                className="
                  text-sm
                  text-zinc-500
                "
              >
                Your personal information
              </p>

            </div>

          </div>


          <div
            className="
              mt-7
              grid
              gap-5
              sm:grid-cols-2
            "
          >

            <div
              className="
                rounded-2xl
                border
                border-white/[0.06]
                bg-black/20
                p-5
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-zinc-500
                "
              >

                <User size={16} />

                Name

              </div>


              <p
                className="
                  mt-3
                  text-lg
                  font-semibold
                "
              >
                {user?.name}
              </p>

            </div>


            <div
              className="
                rounded-2xl
                border
                border-white/[0.06]
                bg-black/20
                p-5
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-zinc-500
                "
              >

                <Mail size={16} />

                Email

              </div>


              <p
                className="
                  mt-3
                  break-all
                  text-lg
                  font-semibold
                "
              >
                {user?.email}
              </p>

            </div>

          </div>

        </section>


        {/* ===================================================
            CHANGE PASSWORD
        =================================================== */}

        <section
          className="
            mt-6
            rounded-[24px]
            border
            border-white/[0.08]
            bg-white/[0.035]
            p-6
            backdrop-blur-2xl
            sm:p-8
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-white/[0.06]
              "
            >

              <Lock size={20} />

            </div>


            <div>

              <h2
                className="
                  text-xl
                  font-bold
                "
              >
                Security
              </h2>


              <p
                className="
                  text-sm
                  text-zinc-500
                "
              >
                Change your account password
              </p>

            </div>

          </div>


          <div
            className="
              mt-7
              grid
              gap-5
              sm:grid-cols-2
            "
          >

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  text-zinc-400
                "
              >
                Current Password
              </label>


              <input
                type="password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(
                    e.target.value
                  )
                }
                placeholder="Current password"
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-black/30
                  px-4
                  py-3
                  text-white
                  outline-none
                  placeholder:text-zinc-600
                  focus:border-white/30
                "
              />

            </div>


            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  text-zinc-400
                "
              >
                New Password
              </label>


              <input
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                placeholder="New password"
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-black/30
                  px-4
                  py-3
                  text-white
                  outline-none
                  placeholder:text-zinc-600
                  focus:border-white/30
                "
              />

            </div>

          </div>


          <button
            onClick={
              handleChangePassword
            }
            className="
              mt-6
              rounded-xl
              bg-white
              px-6
              py-3
              font-semibold
              text-black
              transition
              hover:bg-zinc-200
            "
          >
            Change Password
          </button>

        </section>


        {/* ===================================================
            LOGOUT
        =================================================== */}

        <button
          onClick={handleLogout}
          className="
            mt-6
            flex
            w-full
            items-center
            justify-center
            gap-3
            rounded-[20px]
            border
            border-red-500/20
            bg-red-500/[0.06]
            px-6
            py-4
            font-semibold
            text-red-400
            transition
            duration-300
            hover:border-red-500/40
            hover:bg-red-500/[0.12]
            hover:text-red-300
          "
        >

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </main>

  );

}


export default Profile;