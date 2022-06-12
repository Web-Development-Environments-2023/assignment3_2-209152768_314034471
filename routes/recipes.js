var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const DButils = require("./DButils")

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.get("search/query/{searchQuery}/amount/{num}", async (req, res, next) => {
  try {
    console.log(req.params.query)
    console.log(req.query.num)
    console.log(req.query.cuisine)
    console.log(req.query.diet)
    console.log(req.query.intolerances)
    const recipe = await recipes_utils.searchRecipe(req.params.query,  
      req.query.num, req.query.cuisine, req.query.diet, req.params.intolerances);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.get("/random", (req, res, next) => {
  try{
    const ran = await recipes_utils.getRandomRecipes(req.params.type, req.session.user_id);
    res.send(ran)
  }catch{
    next(error)
  }
});

module.exports = router;
