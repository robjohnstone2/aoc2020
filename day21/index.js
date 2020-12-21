const { readFileSync } = require('fs');

const recipeStrings = readFileSync('./input.txt', 'utf8').trim().split('\n');

const parseRecipe = (str) => {
  const [ingredientsStr, allergensStr] = str.split(' (contains ');
  return {
    ingredients: ingredientsStr.split(' '),
    allergens: allergensStr.substring(0, allergensStr.length - 1).split(', '),
  };
};

const recipes = recipeStrings.map(parseRecipe);

const intersect = (arr1, arr2) => arr1.filter((elm) => arr2.includes(elm));
const unique = (arr) => Array.from(new Set(arr));

const allergens = recipes.reduce((acc, { ingredients, allergens }) => {
  allergens.forEach((allergen) => {
    if (acc[allergen]) {
      acc[allergen] = intersect(acc[allergen], ingredients);
    } else {
      acc[allergen] = ingredients;
    }
  });
  return acc;
}, {});

while (true) {
  let changed = false;
  const ingredientsForAllergen = Object.entries(allergens);
  const matchedIngredients = ingredientsForAllergen
    .filter(([allergen, ingredients]) => ingredients.length === 1)
    .map(([allergen, [i]]) => i);
  ingredientsForAllergen.forEach(([allergen, ingredients]) => {
    const initialIngredients = allergens[allergen];
    allergens[allergen] =
      allergens[allergen].length === 1
        ? allergens[allergen]
        : allergens[allergen].filter(
            (ingredient) => !matchedIngredients.includes(ingredient)
          );
    if (allergens[allergen].length !== initialIngredients.length) {
      changed = true;
    }
  });

  if (!changed) break;
}

const dangerousIngredients = Object.values(allergens).map(
  ([ingredient]) => ingredient
);

const allIngredients = recipes
  .map(({ ingredients }) => ingredients)
  .reduce((acc, arr) => acc.concat(...arr));

const safeIngredients = allIngredients.filter(
  (ingredient) => !dangerousIngredients.includes(ingredient)
);

console.log('part1', safeIngredients.length);

const sortedAllergens = Object.keys(allergens).sort();

console.log('part2', sortedAllergens.map((a) => allergens[a][0]).join());
