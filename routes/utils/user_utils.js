const DButils = require("./DButils");
const recipes_utils = require("./recipes_utils");

async function markAsFavorite(user_id, recipe_id){
  let fav = await DButils.execQuery(`select * from favorite_recipes where user_id='${user_id}' and recipe_id='${recipe_id}'`);
  if(fav.lenght == 0){
    await DButils.execQuery(`insert into favorite_recipes values ('${user_id}',${recipe_id})`)
  }
}

//get favorite recipe for user
async function getFavoriteRecipes(user_id){
    const favorite_recipes = await DButils.execQuery(`select recipe_id from favorite_recipes where user_id='${user_id}'`);
    return extractRecipeIds(favorite_recipes);
}


// get family recipes
async function getFamilyRecipes(user_id){
    const family_recipes = await DButils.execQuery(`select recipe_id from family_recipes where user_id='${user_id}'`);
    return extractRecipeIds(family_recipes);
}   

//add family recipes
async function addFamilyRecipes(owner_recipe, when_eat, ingredients,instructions, user_id, recipe_id){
  await DButils.execQuery(`insert into family_recipes values ('${user_id}', '${recipe_id}', '${owner_recipe}', '${when_eat}', '${ingredients}', '${instructions}')`);
}

   
//get user recipe
async function getUserRecipe(user_id) {
  const user_recipes= await DButils.execQuery(`select recipe_id from personalRecipes where user_id='${user_id}'`);
  return extractRecipeIds(user_recipes);
}

//add user recipe
async function addUserRecipe(user_id, recipe_id, duration, likes, image, vegan, vegetarian, glutenFree, instructions){
  await DButils.execQuery(`insert into personalRecipes values ( '${user_id}', '${recipe_id}', ${duration},'${likes}','${image}', ${vegan}, ${vegetarian}, ${glutenFree}, '${user_name}', '${extendedIngredients}', '${instructions}', '${servings}')`);
}

//add watched recipe
async function addWatchedRecipe(user_id, recipe_id){
  await DButils.execQuery(`insert into watchedrecipes values ( '${user_id}', '${recipe_id}')`);
}

//get 3 lastest recipes
//we need list or array of all the recipes and return the 3 last recipes
async function getLatestWatchedRecipes(user_id, num){
  const latest_watched_recipes = await DButils.execQuery(`select recipe_id, max(id) as max_id from watchedrecipes where user_id=${user_id} group by recipe_id order by max_id desc ${num ? 'limit ' + num : ''}`);
  // "Promise.all" - need to wait for all the awaits to finish - source https://simplernerd.com/js-async-await-map/
  return await Promise.all(latest_watched_recipes.map(async (watched_recipe) => {
    return await recipes_utils.getRecipePreview(watched_recipe.recipe_id)
  }))
}

//recipe watched
async function getWatchedRecipeIds(user_id){
  const watched_recipes = await DButils.execQuery(`select distinct recipe_id from watchedrecipes where user_id=${user_id}`);
  return extractRecipeIds(watched_recipes);
}

function extractRecipeIds(records) {
  return records.map((r) => r.recipe_id);
}
  
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getFamilyRecipes = getFamilyRecipes;
exports.addFamilyRecipes = addFamilyRecipes;
exports.getUserRecipe = getUserRecipe;
exports.addUserRecipe = addUserRecipe;
exports.getLatestWatchedRecipes = getLatestWatchedRecipes;
exports.getWatchedRecipeIds = getWatchedRecipeIds;
exports.addWatchedRecipe = addWatchedRecipe;

