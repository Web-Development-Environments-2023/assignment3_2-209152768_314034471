const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}


async function getFamilyRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id, name, recipeMaker, readyInMinutes, ingredients, instructions, image from RecipeFullInfo where user_id='${user_id}'`);
    return recipes_id;
}    
   

async function getUserInfoOnRecipes(user, ids) {
    var query = " SELECT * FROM RecipeFullInfo where user_id='" + user + "'";
      let obj = {};
      const recipesResultFromDB = await DButils.execQuery(query);
      let result = recipesResultFromDB
        .filter((x) => ids.includes(x.recipe_id))
        .map((x) => {
          obj = { [x.recipe_id]: { saved: x.saved, watched: x.watched } };
          return obj;
        });
  
      for (let i = 0; i < ids.length; i++) {
        var bol = false;
        for (let k = 0; k < result.length; k++) {
          if (ids[i] in result[k]) {
            bol = true;
          }
        }
        if (bol === false) {
          result.push({ [ids[i]]: { saved: false, watched: false } });
        }
      }
      return result;
}
    
  
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getFamilyRecipes = getFamilyRecipes;
exports.getUserInfoOnRecipes = getUserInfoOnRecipes

