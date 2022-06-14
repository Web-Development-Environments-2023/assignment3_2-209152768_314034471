var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});

//FAVORITE PAGE

/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});


//FAMILY PAGE

//show the family recipe
router.get("/family",async(req, res, next)=>{
  try{
    const recipes = await user_utils.getFamilyRecipes(req.session.user_id)
    res.status(200).send(recipes);
  } catch(error){
    next(error);
  }
});

//add new recipe for family
router.post("/family",async(req, res, next)=>{
  try{
    const user_id = req.user_id;
    const recipe_id = req.user_id;
    const owner_recipe = req.owner_recipe;
    const when_eat = req.when_eat;
    const ingredients = req.ingredients;
    const instructions = req.instructions;
    await user_utils.addFamilyRecipes(owner_recipe, when_eat, ingredients,instructions, user_id, recipe_id)
    res.status(200).send("Add recipe successfully");
  } catch(error){
    next(error);
  }
});

//PERSONAL PAGE

//get user's recipes
router.get("/personal",async(req, res, next)=>{
  try{
    const recipes = await user_utils.getUserRecipe(req.session.user_id)
    res.status(200).send(recipes);
  } catch(error){
    next(error);
  }
});

//add new recipe to user
router.get("/personal",async(req, res, next)=>{
  try{
    let params = {}
    params.user_id = req.user_id
    params.recipe_id = req.recipe_id
    params.duration =  req.duration
    params.likes = req.likes
    params.image = req.image
    params.vegan = req.vegan
    params.vegetarian = req.vegetarian
    params.glutenFree = req.glutenFree
    params.instructions = req.instructions
    await user_utils.addUserRecipe(params);
    res.status(200).send("The recipe added!");
  } catch(error){
    next(error);
  }
});

//

//3 watched recipes
router.get('/watchedList', async (req,res,next) => {
  try{
    const recipes_id = await user_utils.getTreeLastRecipes(recipes_id);
    const results = recipes_id;
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});


//only get watch
router.get('/watched', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const result = await user_utils.getWatchedRecipes(user_id);
   res.status(200).send(result);
  } catch(error){
    next(error); 
  }
});

module.exports = router;
