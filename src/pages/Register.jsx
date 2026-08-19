import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { ArrowRight } from "lucide-react";

import { registerUser } from "../api/authApi";

import logo from "../assets/logo.png";


function Register() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // =====================================================
  // REGISTER
  // =====================================================

  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");


    // Check passwords

    if (password !== confirmPassword) {

      setError(
        "Passwords do not match"
      );

      return;

    }


    // Minimum password length

    if (password.length < 6) {

      setError(
        "Password must be at least 6 characters"
      );

      return;

    }


    setLoading(true);


    try {

      await registerUser({
        name,
        email,
        password,
      });


      // Registration successful

      navigate("/login", {
        replace: true,
        state: {
          registered: true,
          email,
        },
      });


    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Registration Failed"
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
          h-[650px]
          w-[650px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/[0.035]
          blur-[160px]
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
          py-20
          sm:px-8
          sm:py-24
        "
      >

        {/* =================================================
            REGISTER CARD
        ================================================= */}

        <div
          className="
            w-full
            max-w-[460px]
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
              HEADER
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
              sm:pt-9
            "
          >

            {/* LOGO */}

            <div
              className="
                mb-6
                flex
                justify-center
              "
            >

              <img
                src={logo}
                alt="WatchNow"
                className="
                  h-auto
                  w-44
                  object-contain
                  sm:w-52
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
              Create your account
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
              Join WatchNow and keep all your
              favorite movies and shows in one place.
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
              sm:py-8
            "
          >

            <form
              onSubmit={handleRegister}
              className="space-y-4"
            >

              {/* =================================================
                  NAME
              ================================================= */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-zinc-300
                  "
                >
                  Full Name
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

                  <FaUser
                    className="
                      ml-4
                      flex-shrink-0
                      text-sm
                      text-zinc-500
                    "
                  />


                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    required
                    className="
                      w-full
                      bg-transparent
                      px-3
                      py-3.5
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-zinc-600
                    "
                  />

                </div>

              </div>


              {/* =================================================
                  EMAIL
              ================================================= */}

              <div>

                <label
                  className="
                    mb-2
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
                      py-3.5
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-zinc-600
                    "
                  />

                </div>

              </div>


              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div>

                <label
                  className="
                    mb-2
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
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                    className="
                      w-full
                      bg-transparent
                      px-3
                      py-3.5
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


              {/* =================================================
                  CONFIRM PASSWORD
              ================================================= */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-zinc-300
                  "
                >
                  Confirm Password
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
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    required
                    className="
                      w-full
                      bg-transparent
                      px-3
                      py-3.5
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-zinc-600
                    "
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
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
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showConfirmPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}

                  </button>

                </div>

              </div>


              {/* =================================================
                  ERROR
              ================================================= */}

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


              {/* =================================================
                  REGISTER BUTTON
              ================================================= */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  mt-2
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

                    Creating account...

                  </>

                ) : (

                  <>
                    Create Account

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
                LOGIN
            ================================================= */}

            <div
              className="
                mt-6
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
                Already have an account?

                <Link
                  to="/login"
                  className="
                    ml-1.5
                    font-semibold
                    text-white
                    transition
                    hover:text-zinc-300
                  "
                >
                  Sign in
                </Link>

              </p>

            </div>

          </div>

        </div>

      </div>

    </main>

  );
}


export default Register;