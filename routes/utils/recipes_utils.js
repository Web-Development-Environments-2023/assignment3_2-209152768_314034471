const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeDetails(recipe_id) {
    const recipeInfo = await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
    
    return getRecipyDetails(recipeInfo.data);
}


async function searchRecipes(query, num, cuisine, diet, intolerances){
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

    return getRecipesData(recipes.data.results);
}
      

async function getRandomRecipes(num) {
    const recipes = await axios.get(`${api_domain}/random`, {
        params: {
            apiKey: process.env.spooncular_apiKey,
            number: num
        }
    })

    return getRecipesData(recipes.data.recipes);
}

function getRecipesData(recipes) {
    return recipes.map(getRecipyData)
}

function getRecipyData(recipe) {
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
}

function getRecipyDetails(recipe) {
    return {
        ...getRecipyData(recipe),
        servings: recipe.servings,
        instructions: recipe.instructions,
        ingredients: getIngredientsData(recipe.extendedIngredients)
    }
}

function getIngredientsData(ingredients) {
    return ingredients.map((ingredient) => {
        return {
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
            originalName: ingredient.originalName
        }
    })
}


exports.getRecipeDetails = getRecipeDetails;
exports.searchRecipes = searchRecipes;
exports.getRandomRecipes = getRandomRecipes;




