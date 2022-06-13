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
    const recipes = await axios.get(`${api_domain}/complexSearch`,{
        params:{
            apiKey: process.env.spooncular_apiKey,
            query: query,
            number: num,
            cuisine: cuisine,
            diet: diet,
            intolerances: intolerances,
            addRecipeInformation: true
        }
    })

    return recipes.data.results.map(function(recipe) {
        return {
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            duration: recipe.readyInMinutes,
            likes: recipe.aggregateLikes,
            vegetarian: recipe.vegetarian,
            vegan: recipe.vegan,
            glutenFree: recipe.glutenFree
        }
    });
}
      

async function getRandomRecipe() {
    const res = await axios.get(`${api_domain}/random`, {
        params: {
            apiKey: process.env.spooncular_apiKey,
            number: 3,
        }
    })
    return res;
}



exports.getRecipeDetails = getRecipeDetails;
exports.searchRecipe = searchRecipe;
exports.getRandomRecipe = getRandomRecipe;




