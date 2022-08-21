var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipes_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery(`SELECT * FROM users WHERE id=${req.session.user_id}`)
      .then((users) => {
        if (!users[0]) { 
          res.sendStatus(401);
        }
        req.user_id =  req.session.user_id; 
        next();
    }).catch(err => next(err));
  } else {
      res.sendStatus(401);
      next();
  }
});

//Added Recipes
router.post('/addRecipe', async (req,res,next) => {
  try{
      const user_id = req.session.user_id;
      const title = req.session.title;
      const readyInMinutes = req.session.readyInMinutes;
      const ingredients = req.session.ingredients;
      const image = req.session.image;
      const vegan = req.session.vegan;
      const vegetarian = req.session.vegetarian;
      const glutenFree = req.session.glutenFree;
      const instructions = req.session.instructions;
      const recipeOwner = rq.session.recipeOwner;
    
    await user_utils.addFamilyRecipes(user_id, title, readyInMinutes,ingredients, image, vegan, vegetarian, glutenFree, instructions, recipeOwners)
    status_code: 1

    res.status(201).send("The Recipe saved");
    } catch(error){
      next(error);
  }
})

//FAVORITE PAGE

/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    console.log("add favorite", user_id, recipe_id);
    await user_utils.markAsFavorite(user_id,recipe_id);
    status_code: 1
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
    const favorite_recipes_ids = await user_utils.getFavoriteRecipes(user_id);
    // "Promise.all" - need to wait for all the awaits to finish - source https://simplernerd.com/js-async-await-map/
    let results;
    try {
      results = await Promise.all(favorite_recipes_ids.map(async (recipe_id) => {
        return await recipes_utils.getRecipePreview(recipe_id)
        
      }))
    }
    catch {
      results = favorite_recipes_ids.map(recipe_id => {return {id: recipe_id}});
    }
    status_code: 1

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
    status_code: 1

    res.status(200).send(recipes);
  } catch(error){
    next(error);
  }
});

//add new recipe for family
router.post("/family",async(req, res, next)=>{
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipe_id;
    const owner_recipe = req.body.owner_recipe;
    const when_eat = req.body.when_eat;
    const ingredients = req.body.ingredients;
    const instructions = req.body.instructions;
    await user_utils.addFamilyRecipes(owner_recipe, when_eat, ingredients,instructions, user_id, recipe_id)
    status_code: 1
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
    status_code: 1

    res.status(200).send(recipes);
  } catch(error){
    next(error);
  }
});

//add new recipe to user
router.post("/personal",async(req, res, next)=>{
  try{
    const user_id = req.session.user_id
    const recipe_id = req.body.recipe_id
    const duration = req.body.duration
    const likes = req.body.likes
    const image = req.body.image
    const vegan = req.body.vegan
    const vegetarian = req.body.vegetarian
    const glutenFree = req.body.glutenFree
    const instructions = req.body.instructions
    await user_utils.addUserRecipe(user_id, recipe_id, duration, likes, image, vegan, vegetarian, glutenFree, instructions);
    status_code: 1
    res.status(200).send("The recipe added!");
  } catch(error){
    next(error);
  }
});


//3 watched recipes
router.get('/watchedList', async (req,res,next) => {
  try{
    const recipes = await user_utils.getLatestWatchedRecipes(req.session.user_id, 3);
    status_code: 1

    res.status(200).send(recipes);
  } catch(error){
    next(error); 
  }
});


//only get watch
router.get('/watched', async (req,res,next) => {
  try{
    const recipe_ids = await user_utils.getWatchedRecipeIds(req.session.user_id);
    status_code: 1

    res.status(200).send(recipe_ids);
  } catch(error){
    next(error); 
  }
});


router.post('/watched', async (req,res,next) => {
  try{
    await user_utils.addWatchedRecipe(req.session.user_id, req.body.recipe_id);
    status_code: 1

    res.status(200).send();
  } catch(error){
    next(error); 
  }
});

module.exports = router;
