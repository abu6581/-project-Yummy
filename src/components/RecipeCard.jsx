export default function RecipeCard({
  meal,
  isFavorite,
  onFavorite,
  onDetails
}) {
  return (
    <article className="recipe-card">

      <div className="recipe-image-wrap">

        <img
          className="recipe-image"
          src={meal.strMealThumb}
          alt={meal.strMeal}
          loading="lazy"
        />

        <button
          className={`favorite-button ${
            isFavorite ? "is-favorite" : ""
          }`}
          type="button"
          onClick={() => onFavorite(meal)}
        >
          {isFavorite ? "♥" : "♡"}
        </button>

      </div>

      <div className="recipe-info">

        <div className="recipe-meta">
          <span>{meal.strCategory || "Recipe"}</span>
          <span>{meal.strArea || "World cuisine"}</span>
        </div>

        <h3>{meal.strMeal}</h3>

        <button
          className="details-button"
          onClick={() => onDetails(meal)}
        >
          View recipe →
        </button>

      </div>

    </article>
  );
}