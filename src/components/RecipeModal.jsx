export default function RecipeModal({
  meal,
  onClose
}) {
  if (!meal) return null;

  const ingredients = Array.from(
    { length: 20 },
    (_, index) => {
      const number = index + 1;

      const ingredient =
        meal[`strIngredient${number}`]?.trim();

      const measure =
        meal[`strMeasure${number}`]?.trim();

      if (!ingredient) return null;

      return `${measure ? `${measure} ` : ""}${ingredient}`;
    }
  ).filter(Boolean);

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >

      <section
        className="recipe-modal"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >

        <button
          className="modal-close"
          onClick={onClose}
        >
          ×
        </button>

        <img
          className="modal-image"
          src={meal.strMealThumb}
          alt={meal.strMeal}
        />

        <div className="modal-content">

          <h2>{meal.strMeal}</h2>

          <p>
            {meal.strArea} · {meal.strCategory}
          </p>

          <h3>Ingredients</h3>

          <ul className="ingredient-list">
            {ingredients.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3>Instructions</h3>

          <p className="instructions">
            {meal.strInstructions}
          </p>

          {meal.strYoutube && (
            <a
              href={meal.strYoutube}
              target="_blank"
              rel="noreferrer"
              className="video-link"
            >
              Watch cooking video ↗
            </a>
          )}

        </div>

      </section>

    </div>
  );
}