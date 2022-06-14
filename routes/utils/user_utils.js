const DButils = require("./DButils");
const recipes_utils = require("./recipes_utils");

async function markAsFavorite(user_id, recipe_id){
  let fav = await DButils.execQuery(`select * from db.FavoriteRecipes where user_id='${user_id}' and recipe_id='${recipe_id}'`);
  if(fav.lenght == 0){
    await DButils.execQuery(`insert into db.FavoriteRecipes values ('${user_id}',${recipe_id})`)
  }
}

//get favorite recipe for user
async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from db.FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}


// get family recipes
async function getFamilyRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from familyRecipes where user_id='${user_id}'`);
    return recipes_id;
}   

//add family recipes
async function addFamilyRecipes(owner_recipe, when_eat, ingredients,instructions, user_id, recipe_id){
  await DButils.execQuery(`insert into db.familyRecipes values ('${user_id}', '${recipe_id}', '${owner_recipe}', '${when_eat}', '${ingredients}', '${instructions}')`);
}

   
//get user recipe
async function getUserRecipe(user_id) {
  const recipes_id= await DButils.execQuery(`select recipe_id from personalRecipes where user_id='${user_id}'`);
  return recipes_id; 
}

//add user recipe
async function addUserRecipe(params){
  const user_id = params.user_id
  const recipe_id = params.recipe_id
  const duration =  params.duration
  const likes = params.likes
  const image = params.image
  const vegan = params.vegan
  const vegetarian = params.vegetarian
  const glutenFree = params.glutenFree
  const instructions = params.instructions
  await DButils.execQuery(`insert into personalRecipes values ( '${user_id}', '${recipe_id}', ${duration},'${likes}','${image}', ${vegan}, ${vegetarian}, ${glutenFree}, '${user_name}', '${extendedIngredients}', '${instructions}', '${servings}')`);

}

//get 3 lastest recipes
//we need list or array of all the recipes and return the 3 last recipes
async function getTreeLastRecipes(recipes_id){
  let recipe_list = []
  for(let i = 0; i < recipes_id.lenght; i++){
    if(i == 3){
      break;
    }else{
      recipe_list.push(await recipes_utils.getRecipeDetails(recipes_id[i]))
    }
  }
  return recipe_list

}

//recipe watched
async function getWatchedRecipes(user_id){
  const recipes_id = await DButils.execQuery(`select recipe_id from db.watchedRecipes where username='${user_id}'`);
  return recipes_id;
}

    
  
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getFamilyRecipes = getFamilyRecipes;
exports.addFamilyRecipes = addFamilyRecipes;
exports.getUserRecipe = getUserRecipe;
exports.addUserRecipe = addUserRecipe;
exports.getTreeLastRecipes = getTreeLastRecipes;
exports.getWatchedRecipes = getWatchedRecipes;

