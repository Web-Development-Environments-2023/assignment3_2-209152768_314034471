const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}



async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}


async function searchRecipe(query, num, cuisine, diet, intolerances){
<<<<<<< HEAD
   /////////////////////////////////
=======
    let recipe = router.get("/search/query/:searchQuery/amount/:num", (req, res) => {
    const { searchQuery, num } = req.params; 
    if (searchQuery == "<string>") {
        res.send({ message: "searchQuery parameter is missing" });
    }
    search_params = {};
    search_params.query = searchQuery; 
    search_params.number = num;
    search_params.instructionRequired = true;
      
    //check if optional queries params exists (cuisine,diet,intolerance) and if they exist we will add them to search_params
    search_util.extractQueriesParams(req.query, search_params);
    search_util
    .searchForRescipes(search_params)
    .then((info_array) => res.send(info_array)) // return to client info array about the recipes that return from the search
    });
>>>>>>> a335d6de4d1e2a4cb4df68da3cc3a0b9fe76c11b
}
      

async function getRandomRecipe() {
    let res = await axios.get(`${api_domain}/random`, {
        params: {
            apiKey: process.env.spooncular_apiKey,
            number: 3,
        },
    })
    return res;
}



exports.getRecipeDetails = getRecipeDetails;
exports.searchRecipe = searchRecipe;
exports.getRandomRecipe = getRandomRecipe;




