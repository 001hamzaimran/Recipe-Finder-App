document.getElementById('search-btn').addEventListener('click', function () {
    const ingredients = document.getElementById('ingredients').value;

    if (!ingredients) {
        alert('Please enter at least one ingredient.');
        return;
    }

    const apiKey = 'c15b6f06e928487d9c9fb3a47c904086';
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&number=5&apiKey=${apiKey}`;

    showLoader(true); // Show loader

    fetch(url)
        .then(response => response.json())
        .then(data => {
            showLoader(false); // Hide loader
            displayRecipes(data);
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
            showLoader(false);
            showAlert('Failed to fetch recipes. Please try again.', 'danger');
        });

    document.getElementById('ingredients').value = ''; // Clear input field
});

function displayRecipes(recipes) {
    const resultsDiv = document.getElementById('recipe-results');
    resultsDiv.innerHTML = '';

    if (recipes.length === 0) {
        showAlert('No recipes found. Try different ingredients.', 'warning');
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
            </div>`;
        resultsDiv.innerHTML += recipeCard;
    });
}

function getRecipeDetails(recipeId) {
    const apiKey = 'c15b6f06e928487d9c9fb3a47c904086';
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('recipeModalLabel').textContent = data.title;
            document.getElementById('modal-recipe-image').src = data.image;
            document.getElementById('modal-instructions').textContent = data.instructions;
            document.getElementById('modal-ingredients').innerHTML = data.extendedIngredients
                .map(ingredient => `<li>${ingredient.original}</li>`)
                .join('');
            const modal = new bootstrap.Modal(document.getElementById('recipeModal'));
            modal.show();
        })
        .catch(error => {
            console.error('Error fetching recipe details:', error);
        });
}

function showLoader(isVisible) {
    const loader = document.getElementById('loader');
    loader.style.display = isVisible ? 'block' : 'none';
}

function showAlert(message, type) {
    const alertBox = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
    document.getElementById('recipe-results').innerHTML = alertBox;
}
