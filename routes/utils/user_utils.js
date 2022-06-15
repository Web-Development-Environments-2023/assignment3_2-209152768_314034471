const DButils = require("./DButils");
const recipes_utils = require("./recipes_utils");

async function markAsFavorite(user_id, recipe_id){
  let fav = await DButils.execQuery(`select * from FavoriteRecipes where user_id='${user_id}' and recipe_id='${recipe_id}'`);
  if(fav.lenght == 0){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`)
  }
}

//get favorite recipe for user
async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}


// get family recipes
async function getFamilyRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from familyRecipes where user_id='${user_id}'`);
    return recipes_id;
}   

//add family recipes
async function addFamilyRecipes(owner_recipe, when_eat, ingredients,instructions, user_id, recipe_id){
  await DButils.execQuery(`insert into familyRecipes values ('${user_id}', '${recipe_id}', '${owner_recipe}', '${when_eat}', '${ingredients}', '${instructions}')`);
}

   
//get user recipe
async function getUserRecipe(user_id) {
  const recipes_id= await DButils.execQuery(`select recipe_id from personalRecipes where user_id='${user_id}'`);
  return recipes_id; 
}

//add user recipe
async function addUserRecipe(user_id, recipe_id, duration, likes, image, vegan, vegetarian, glutenFree, instructions){
  await DButils.execQuery(`insert into personalRecipes values ( '${user_id}', '${recipe_id}', ${duration},'${likes}','${image}', ${vegan}, ${vegetarian}, ${glutenFree}, '${user_name}', '${extendedIngredients}', '${instructions}', '${servings}')`);

}

//get 3 lastest recipes
//we need list or array of all the recipes and return the 3 last recipes
async function getLatestWatchedRecipes(user_id, num){
  const recipe_ids = await getWatchedRecipeIds(user_id, num)
  // "Promise.all" - need to wait for all the awaits to finish - source https://simplernerd.com/js-async-await-map/
  return await Promise.all(recipe_ids.map(async (recipe_id) => {
    return await recipes_utils.getRecipeDetails(recipe_id)
  }))
}

//recipe watched
async function getWatchedRecipeIds(user_id, limit){
  const watchedRecipes =  await DButils.execQuery(`select recipe_id, max(create_time) as last_watch from watchedRecipes where user_id=${user_id} group by recipe_id order by last_watch desc ${limit ? 'limit ' + limit : ''}`);
  return watchedRecipes.map((wr) => wr.recipe_id);
}

    
  
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getFamilyRecipes = getFamilyRecipes;
exports.addFamilyRecipes = addFamilyRecipes;
exports.getUserRecipe = getUserRecipe;
exports.addUserRecipe = addUserRecipe;
exports.getLatestWatchedRecipes = getLatestWatchedRecipes;
exports.getWatchedRecipeIds = getWatchedRecipeIds;

