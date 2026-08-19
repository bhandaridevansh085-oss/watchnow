import logo from "../assets/logo.png";

function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-800">
      <div className="mx-auto max-w-7xl px-8 py-16">

        <div className="grid gap-12 md:grid-cols-3">

          <div>
            <img
              src={logo}
              alt="WatchNow"
              className="h-14"
            />

            <p className="mt-5 leading-7 text-zinc-400">
              WatchNow is a modern movie discovery platform built
              with React, Tailwind CSS and TMDB.
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-xl font-bold">
              Navigation
            </h3>

            <ul className="space-y-3 text-zinc-400">
              <li>Home</li>
              <li>Movies</li>
              <li>Genres</li>
              <li>Favorites</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xl font-bold">
              About
            </h3>

            <p className="leading-7 text-zinc-400">
              Discover. Watch. Remember.
              <br />
              More features including AI recommendations are coming soon.
            </p>
          </div>

        </div>

        <div className="mt-12 border-t border-zinc-800 pt-8 text-center text-zinc-500">
          © 2026 WatchNow. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;