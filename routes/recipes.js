var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const DButils = require("./utils/DButils")



router.get("/search", async (req, res, next) => {
  try {
    const query = req.query.query;
    const num = req.query.num;
    const cuisine = req.query.cuisine;
    const diet = req.query.diet;
    const intolerances = req.query.intolerances;
    const recipes = await recipes_utils.searchRecipes(query, num, cuisine, diet, intolerances);
    status_code: 1
    res.send(recipes);

  } catch (error) {
    next(error);
  }
});

router.get("/random", async (req, res, next) => {
  try{
    const num = req.query.num;
    const recipes = await recipes_utils.getRandomRecipes(num);
    status_code: 1
    res.send(recipes)


  }catch{
    next(error)
  }
});
/**
 * This path returns details of a recipe by id
 */
router.get("/family", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getFamilyRecipes();
    status_code: 1
    res.send(recipe);

  } catch (error) {
    next(error);
  }
});


/**
 * This path returns a full details of a recipe by its id
 */
 router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipePreview(req.params.recipeId);
    res.send(recipe);
    status_code: 1
  } catch (error) {
    next(error);
  }
});


module.exports = router;
