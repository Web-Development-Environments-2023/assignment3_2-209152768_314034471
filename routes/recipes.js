var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const DButils = require("./utils/DButils")

router.get("/", (req, res) => res.send("im here"));


router.get("/search", async (req, res, next) => {
  try {
    const query = req.query.query;
    const num = req.query.num;
    const cuisine = req.query.cuisine;
    const diet = req.query.diet;
    const intolerances = req.query.intolerances;
    const recipe = await recipes_utils.searchRecipe(query, num, cuisine, diet, intolerances);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.get("/random", async (req, res, next) => {
  try{
    const ran = await recipes_utils.getRandomRecipe(req.params.type, req.session.user_id);
    res.send(ran)
  }catch{
    next(error)
  }
});


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


module.exports = router;
