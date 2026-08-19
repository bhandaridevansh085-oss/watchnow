import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";


import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shows from "./pages/Shows";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import TVDetails from "./pages/TVDetails";
import GenreMovies from "./pages/GenreMovies";
import PersonDetails from "./pages/PersonDetails";
import Abyss from "./pages/Abyss";

function App() {
  return (
    <>
      <ScrollToTop />

      {/* Floating navbar */}
      <Navbar />

      {/* No top padding here */}
      <main className="min-h-screen bg-[#080808]">
        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/movies"
            element={<Movies />}
          />
          <Route
  path="/abyss"
  element={<Abyss />}
/>
          <Route
            path="/movie/:id"
            element={<MovieDetails />}
          />

          <Route
            path="/genre/:id"
            element={<GenreMovies />}
          />

          <Route
            path="/tv/:id"
            element={<TVDetails />}
          />

          

          <Route
            path="/person/:id"
            element={<PersonDetails />}
          />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={<Login />}
          />

          
          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/shows"
            element={<Shows />}
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>
      </main>
    </>
  );
}

export default App;