import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { ArrowRight } from "lucide-react";

import { loginUser } from "../api/authApi";

import logo from "../assets/logo.png";


function Login() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const data = await loginUser({
        email,
        password,
      });


      // Save authentication

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );


      // Update Navbar immediately

      window.dispatchEvent(
        new Event("auth-change")
      );


      // Go home

      navigate("/", {
        replace: true,
      });


    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Invalid email or password"
      );

    } finally {

      setLoading(false);

    }

  };


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
          BACKGROUND IMAGE
      ================================================= */}

      <div
        className="
          absolute
          inset-0
          bg-cover
          bg-center
        "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1920&auto=format&fit=crop')",
        }}
      />


      {/* =================================================
          CINEMATIC OVERLAY
      ================================================= */}

      <div
        className="
          absolute
          inset-0
          bg-black/75
        "
      />


      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-black
          via-black/70
          to-black/40
        "
      />


      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-[#050505]
          via-transparent
          to-black/40
        "
      />


      {/* =================================================
          BACKGROUND GLOW
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[600px]
          w-[600px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/[0.035]
          blur-[150px]
        "
      />


      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-5
          py-24
          sm:px-8
        "
      >

        {/* =================================================
            LOGIN CARD
        ================================================= */}

        <div
          className="
            w-full
            max-w-[440px]
            overflow-hidden
            rounded-[28px]
            border
            border-white/[0.12]
            bg-black/45
            shadow-[0_30px_100px_rgba(0,0,0,0.65)]
            backdrop-blur-2xl
          "
        >

          {/* =================================================
              TOP
          ================================================= */}

          <div
            className="
              border-b
              border-white/[0.07]
              px-7
              pb-7
              pt-8
              text-center
              sm:px-9
              sm:pt-10
            "
          >

            {/* LOGO */}

            <div
              className="
                mb-7
                flex
                justify-center
              "
            >

              <img
                src={logo}
                alt="WatchNow"
                className="
                  h-auto
                  w-48
                  object-contain
                  sm:w-56
                "
              />

            </div>


            <h1
              className="
                text-3xl
                font-black
                tracking-tight
                sm:text-4xl
              "
            >
              Welcome back
            </h1>


            <p
              className="
                mx-auto
                mt-3
                max-w-sm
                text-sm
                leading-6
                text-zinc-400
              "
            >
              Sign in to keep your movies,
              shows and favorites in one place.
            </p>

          </div>


          {/* =================================================
              FORM
          ================================================= */}

          <div
            className="
              px-7
              py-7
              sm:px-9
              sm:py-9
            "
          >

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* EMAIL */}

              <div>

                <label
                  className="
                    mb-2.5
                    block
                    text-sm
                    font-medium
                    text-zinc-300
                  "
                >
                  Email
                </label>

                <div
                  className="
                    flex
                    items-center
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.045]
                    transition
                    duration-300
                    focus-within:border-white/25
                    focus-within:bg-white/[0.07]
                  "
                >

                  <FaEnvelope
                    className="
                      ml-4
                      flex-shrink-0
                      text-sm
                      text-zinc-500
                    "
                  />

                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                    className="
                      w-full
                      bg-transparent
                      px-3
                      py-4
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-zinc-600
                    "
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div>

                <label
                  className="
                    mb-2.5
                    block
                    text-sm
                    font-medium
                    text-zinc-300
                  "
                >
                  Password
                </label>

                <div
                  className="
                    flex
                    items-center
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.045]
                    transition
                    duration-300
                    focus-within:border-white/25
                    focus-within:bg-white/[0.07]
                  "
                >

                  <FaLock
                    className="
                      ml-4
                      flex-shrink-0
                      text-sm
                      text-zinc-500
                    "
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                    className="
                      w-full
                      bg-transparent
                      px-3
                      py-4
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-zinc-600
                    "
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="
                      mr-4
                      flex-shrink-0
                      text-zinc-500
                      transition
                      hover:text-white
                    "
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}

                  </button>

                </div>

              </div>


              {/* REMEMBER */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  text-xs
                  sm:text-sm
                "
              >

                <label
                  className="
                    flex
                    cursor-pointer
                    items-center
                    gap-2
                    text-zinc-400
                  "
                >

                  <input
                    type="checkbox"
                    className="
                      h-4
                      w-4
                      cursor-pointer
                      accent-white
                    "
                  />

                  Remember me

                </label>


                <button
                  type="button"
                  className="
                    text-zinc-400
                    transition
                    hover:text-white
                  "
                >
                  Forgot password?
                </button>

              </div>


              {/* ERROR */}

              {error && (

                <div
                  className="
                    rounded-xl
                    border
                    border-red-500/20
                    bg-red-500/[0.08]
                    px-4
                    py-3
                    text-center
                    text-sm
                    text-red-400
                  "
                >
                  {error}
                </div>

              )}


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-white
                  py-4
                  text-sm
                  font-bold
                  text-black
                  shadow-[0_10px_40px_rgba(255,255,255,0.08)]
                  transition
                  duration-300
                  hover:bg-zinc-200
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {loading ? (
                  <>
                    <span
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-black/20
                        border-t-black
                      "
                    />

                    Signing in...

                  </>
                ) : (

                  <>
                    Sign In

                    <ArrowRight
                      size={17}
                      className="
                        transition
                        duration-300
                        group-hover:translate-x-1
                      "
                    />

                  </>

                )}

              </button>

            </form>


            {/* =================================================
                REGISTER
            ================================================= */}

            <div
              className="
                mt-7
                border-t
                border-white/[0.07]
                pt-6
                text-center
              "
            >

              <p
                className="
                  text-sm
                  text-zinc-500
                "
              >
                Don't have an account?

                <Link
                  to="/register"
                  className="
                    ml-1.5
                    font-semibold
                    text-white
                    transition
                    hover:text-zinc-300
                  "
                >
                  Create one
                </Link>

              </p>

            </div>

          </div>

        </div>

      </div>

    </main>

  );
}


export default Login;