import { Link } from "react-router-dom";
import { Github, Instagram, Mail } from "lucide-react";
import logo from "../assets/logo.png";

function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-800 bg-black">
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-8 md:py-16">

        {/* Main Footer */}
        <div className="grid gap-12 md:grid-cols-3">

          {/* Brand */}
          <div>
            <img
              src={logo}
              alt="WatchNow"
              className="h-12 w-auto"
            />

            <p className="mt-5 max-w-md leading-7 text-zinc-400">
              Discover movies and TV shows, explore what's trending,
              save your favorites, and find your next watch.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 transition hover:text-white"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 transition hover:text-white"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>

              <a
                href="mailto:contact@watchnow.com"
                className="text-zinc-500 transition hover:text-white"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Navigation
            </h3>

            <ul className="space-y-3 text-zinc-400">
              <li>
                <Link
                  to="/"
                  className="transition hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/movies"
                  className="transition hover:text-white"
                >
                  Movies
                </Link>
              </li>

              <li>
                <Link
                  to="/genres"
                  className="transition hover:text-white"
                >
                  Genres
                </Link>
              </li>

              <li>
                <Link
                  to="/favorites"
                  className="transition hover:text-white"
                >
                  Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              About WatchNow
            </h3>

            <p className="leading-7 text-zinc-400">
              A modern movie discovery experience built with React,
              Tailwind CSS and TMDB.
            </p>

            <p className="mt-4 text-sm leading-6 text-zinc-500">
              Discover. Watch. Remember.
            </p>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-5 border-t border-zinc-800 pt-8 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">

          <p>
            © {new Date().getFullYear()} WatchNow. All rights reserved.
          </p>

          <p>
            Powered by{" "}
            <span className="text-zinc-400">TMDB</span>
          </p>

        </div>

      </div>
    </footer>
  );
}

export default Footer;