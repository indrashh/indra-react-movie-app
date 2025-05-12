import React, { useEffect } from "react";
import Search from "./components/Search";
import { useState } from "react";
import { useDebounce } from "react-use";
import MovieCard from "./components/MovieCard";
import Spinner from "./components/Spinner";
import { updateSearchCount, getTrendingMovies } from "./appwrite";

// API TMDB
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_OPTION = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [trendingMovie, setTrendingMovie] = useState([]);

  // debounce for for SearchTerm
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 750, [searchTerm]);

  // fETCHING DATA
  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = !query
        ? `${API_BASE_URL}/discover/movie`
        : `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`;

      const response = await fetch(endpoint, API_OPTION);

      if (!response.ok) {
        throw new Error("failed to feching movies");
      }

      const data = await response.json();

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Something Not right try later");
    } finally {
      setIsLoading(false);
    }
  };

  // trending movie
  const loadTrendingMovies = async () => {
    const movies = await getTrendingMovies();
    setTrendingMovie(movies);
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);
  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="/hero.png" alt="hero banner" />
            <h1>
              Find Your Favorite <span className="text-gradient">Movies</span>{" "}
              Without The Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>
        </div>
        {trendingMovie.length > 0 && (
          <section className="trending">
            <h2>Most Relevant Movies</h2>
            <ul>
              {trendingMovie.map((movie, index) => (
                <li key={movie.id || index}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.searchTerm} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="ml-4">All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-600">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
