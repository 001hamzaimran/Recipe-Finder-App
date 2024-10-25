document.getElementById('search-btn').addEventListener('click', function() {
    const ingredients = document.getElementById('ingredients').value;

    if (!ingredients) {
        alert('Please enter at least one ingredient.');
        return;
    }

    // Your API key
    const apiKey = 'c15b6f06e928487d9c9fb3a47c904086'; // Replace with your Spoonacular API key
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&number=5&apiKey=${apiKey}`;

    // Fetch recipes from the API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            
            displayRecipes(data);
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
            document.getElementById('recipe-results').innerHTML = '<p class="text-danger">Failed to fetch recipes. Please try again.</p>';
        });
});

// Function to display recipes
function displayRecipes(recipes) {
    const resultsDiv = document.getElementById('recipe-results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (recipes.length === 0) {
        resultsDiv.innerHTML = '<p>No recipes found. Try different ingredients.</p>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeCard = `
            <div class="card mb-3">
                <div class="row no-gutters">
                    <div class="col-md-4">
                        <img src="${recipe.image}" class="card-img" alt="${recipe.title}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${recipe.title}</h5>
                            <p class="card-text">Used Ingredients: ${recipe.usedIngredientCount} / ${recipe.usedIngredients.length + recipe.missedIngredientCount}</p>
                            <button class="btn btn-info" onclick="getRecipeDetails(${recipe.id})">View Recipe</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        resultsDiv.innerHTML += recipeCard;
    });
}

// Function to fetch and display recipe details
function getRecipeDetails(recipeId) {
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('recipeModalLabel').textContent = data.title;
            document.getElementById('modal-recipe-image').src = data.image;
            document.getElementById('modal-instructions').textContent = data.instructions;
            
            const ingredientsList = data.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('');
            document.getElementById('modal-ingredients').innerHTML = ingredientsList;

            const modal = new bootstrap.Modal(document.getElementById('recipeModal'));
            modal.show();
        })
        .catch(error => {
            console.error('Error fetching recipe details:', error);
        });
}
