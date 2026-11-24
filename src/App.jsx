import {
  useEffect,
  useMemo,
  useState
} from "react";

import RecipeCard from "./components/RecipeCard.jsx";
import RecipeModal from "./components/RecipeModal.jsx";

const API_URL =
  "https://www.themealdb.com/api/json/v1/1/search.php?s=";

const FAVORITES_KEY = "yummy-favorites";

function getSavedFavorites() {
  try {
    return (
      JSON.parse(
        localStorage.getItem(FAVORITES_KEY)
      ) || []
    );
  } catch {
    return [];
  }
}

export default function App() {

  const [meals, setMeals] = useState([]);

  const [searchTerm, setSearchTerm] =
    useState("chicken");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [favorites, setFavorites] =
    useState(getSavedFavorites);

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [showFavorites, setShowFavorites] =
    useState(false);

  const [selectedMeal, setSelectedMeal] =
    useState(null);


  async function fetchMeals(searchValue) {

    setLoading(true);
    setError("");
    setActiveCategory("All");

    try {

      const response = await fetch(
        `${API_URL}${encodeURIComponent(searchValue.trim())}`
      );

      if (!response.ok) {
        throw new Error(
          "Could not connect to the recipe service."
        );
      }

      const data = await response.json();

      setMeals(data.meals || []);

    } catch (fetchError) {

      setError(
        fetchError.message ||
        "Something went wrong. Please try again."
      );

      setMeals([]);

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {
    fetchMeals("chicken");
  }, []);


  useEffect(() => {

    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favorites)
    );

  }, [favorites]);


  function handleSearch(event) {

    event.preventDefault();

    setShowFavorites(false);

    fetchMeals(searchTerm);
  }


  function toggleFavorite(meal) {

    setFavorites((currentFavorites) => {

      const alreadySaved =
        currentFavorites.some(
          (item) => item.idMeal === meal.idMeal
        );

      if (alreadySaved) {

        return currentFavorites.filter(
          (item) => item.idMeal !== meal.idMeal
        );

      }

      return [...currentFavorites, meal];

    });

  }


  const sourceMeals = showFavorites
    ? favorites
    : meals;


  const categories = useMemo(() => {

    return [
      "All",
      ...new Set(
        sourceMeals
          .map((meal) => meal.strCategory)
          .filter(Boolean)
      )
    ];

  }, [sourceMeals]);


  const visibleMeals = useMemo(() => {

    if (activeCategory === "All") {
      return sourceMeals;
    }

    return sourceMeals.filter(
      (meal) =>
        meal.strCategory === activeCategory
    );

  }, [sourceMeals, activeCategory]);


  return (

    <div className="app-shell">

      <header className="topbar">

        <a
          className="brand"
          href="#home"
          onClick={() => setShowFavorites(false)}
        >
          <span className="brand-icon">Y</span>
          <span>yummy<span className="brand-dot">.</span></span>
        </a>

        <nav className="nav-links">

          <a
            href="#home"
            onClick={() => setShowFavorites(false)}
          >
            Home
          </a>

          <button
            className={
              showFavorites
                ? "nav-favorite active"
                : "nav-favorite"
            }
            onClick={() => {
              setShowFavorites(true);
              setActiveCategory("All");
            }}
          >
            ♡ Favorites

            <span className="favorite-count">
              {favorites.length}
            </span>

          </button>

        </nav>

      </header>


      <main id="home">

        <section className="hero-section">

          <div className="hero-copy">

            <p className="eyebrow">
              YOUR DAILY RECIPE INSPIRATION
            </p>

            <h1>
              Find your next
              <br />
              <span>favorite</span> meal.
            </h1>

            <p className="hero-description">
              Simple ingredients, delicious ideas.
              Discover recipes and bring something
              special to your table.
            </p>

            <form
              className="search-form"
              onSubmit={handleSearch}
            >

              <span className="search-icon">⌕</span>

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search recipes..."
              />

              <button
                type="submit"
                disabled={loading}
              >
                Search
              </button>

            </form>

            <p className="search-hint">
              Try: chicken, pasta, beef, salmon
            </p>

          </div>

          <div className="hero-art">

            <div className="hero-circle" />

            <img
              src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85"
              alt="Fresh salad"
            />

            <div className="hero-sticker">
              Made with
              <strong>♥</strong>
            </div>

          </div>

        </section>


        <section className="recipes-section">

          <div className="section-heading">

            <div>
              <p className="eyebrow">
                EXPLORE AND ENJOY
              </p>

              <h2>
                {showFavorites
                  ? "Your favorites"
                  : "Explore recipes"}
              </h2>
            </div>

            <p className="result-count">
              {visibleMeals.length} recipes
            </p>

          </div>


          <div className="filter-row">

            <div className="category-filters">

              {categories.map((category) => (

                <button
                  key={category}
                  className={
                    activeCategory === category
                      ? "filter-chip selected"
                      : "filter-chip"
                  }
                  onClick={() =>
                    setActiveCategory(category)
                  }
                >
                  {category}
                </button>

              ))}

            </div>

            {showFavorites && (

              <button
                className="clear-favorites"
                onClick={() => setFavorites([])}
                disabled={favorites.length === 0}
              >
                Clear favorites
              </button>

            )}

          </div>


          {loading && (

            <div className="status-message">
              <div className="loader" />
              <p>Finding delicious recipes...</p>
            </div>

          )}


          {!loading && error && (

            <div className="status-message error-message">

              <span>!</span>

              <h3>Something went wrong</h3>

              <p>{error}</p>

              <button
                className="retry-button"
                onClick={() => fetchMeals(searchTerm)}
              >
                Try again
              </button>

            </div>

          )}


          {!loading &&
            !error &&
            visibleMeals.length > 0 && (

            <div className="recipe-grid">

              {visibleMeals.map((meal) => (

                <RecipeCard
                  key={meal.idMeal}
                  meal={meal}
                  isFavorite={favorites.some(
                    (item) =>
                      item.idMeal === meal.idMeal
                  )}
                  onFavorite={toggleFavorite}
                  onDetails={setSelectedMeal}
                />

              ))}

            </div>

          )}


          {!loading &&
            !error &&
            visibleMeals.length === 0 && (

            <div className="empty-state">

              <span>🍽️</span>

              <h3>
                {showFavorites
                  ? "No favorites yet"
                  : "No recipes found"}
              </h3>

              <p>
                {showFavorites
                  ? "Tap the heart on a recipe to save it here."
                  : "Try another recipe name."}
              </p>

            </div>

          )}

        </section>

      </main>


      <footer className="footer">

        <a className="brand footer-brand" href="#home">
          <span className="brand-icon">Y</span>
          <span>yummy<span className="brand-dot">.</span></span>
        </a>

        <p>
          Made for food lovers. Powered by TheMealDB.
        </p>

      </footer>


      <RecipeModal
        meal={selectedMeal}
        onClose={() => setSelectedMeal(null)}
      />

    </div>

  );
}