const mealsEl = document.getElementById('meals')
const favContainer = document.getElementById('fav-meals');
const MealPopup = document.getElementById('meal-popup');
const PopupcloseBtn = document.getElementById('close-popup');
const mealInfoEl = document.getElementById('meal-info');
const SearchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');

getRandomMeal();
fetchfavMeals();


async function getRandomMeal(){
	const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
	let responsData = await resp.json();
	let randomMeal = responsData.meals[0];

	console.log(randomMeal)

	addMeal(randomMeal, true);
}

async function getMealById(id){
	const resp =await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);

	const respData = await resp.json();
	const meal = respData.meals[0];

	return meal
}

async function getMealsBySearch(term){
	const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term );

	const respData = await resp.json();
	const meals = respData.meals;

	return meals

}

function addMeal(mealData, random = false){
	const meal = document.createElement('div');
	meal.classList.add('meal');
	meal.innerHTML = `
	<div class="meal-header">
		${random ? `
		<span class="random">
			RandomRecipe
		</span>`: ''}
		<img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
		</div>
		<div class="meal-body">
			<h4>${mealData.strMeal}</h4>
			<button class="fav-btn"><i class="fa fa-heart-o" aria-hidden="true"></i></i></button>
		</div>
	</div>

	`

	const btn = meal.querySelector('.meal-body .fav-btn')
	btn.addEventListener('click', ()=>{
		if(btn.classList.contains('active')){
			removeMealFromLS(mealData.idMeal);
			btn.classList.toggle('active')
		}else{
			addMealToLS(mealData.idMeal);
			btn.classList.add('active')

		}

		fetchfavMeals();
		
	});
	meal.addEventListener('click', ()=>{
		ShowMealInfo(mealData)
	})
	mealsEl.appendChild(meal)

}


function addMealToLS(mealId){
	const mealIds = getMealsFromLS();

	localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}

function removeMealFromLS(mealId){
	const mealIds = getMealsFromLS();
	localStorage.setItem('mealIds', JSON.stringify(mealIds.filter((id) => id !== mealId)));

}

function getMealsFromLS(){
	const mealIds = JSON.parse(localStorage.getItem('mealIds'));

	return mealIds === null ? []: mealIds;
}

async function fetchfavMeals(){

	// clean the container
		favContainer.innerHTML = '';

	const mealIds = getMealsFromLS();

	
	for (let i = 0; i < mealIds.length; i++) {
		const mealId = mealIds[i];
		meal = await getMealById(mealId);
		addMealToFav(meal)


	}
	
	console.log(meals)
}


function addMealToFav(mealData){
	
	const favMeal = document.createElement('li');
	


	favMeal.innerHTML = `
 	<img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"><span>${mealData.strMeal}</span>
	<button class="close"><i class="fas fa-window-close"></i></button>
	`
	const btn = favMeal.querySelector('.close');
	btn.addEventListener('click', ()=>{

		removeMealFromLS(mealData.idMeal);

		fetchfavMeals();
	});
	favMeal.addEventListener('click', ()=>{
		ShowMealInfo(mealData)
	});
	favContainer.appendChild(favMeal)

	
}


function ShowMealInfo(mealData){
	// clean it up
	mealInfoEl.innerHTML = '';

	// update meal indo 
	const mealEl = document.createElement('div');
	const ingredients = [];
	// get ingridients and measures
		for (let i = 1; i < 20; i++) {
			if(mealData['strIngredient'  + i]){
				ingredients.push(`${mealData['strIngredient'+ i]} - ${mealData['strMeasure' + i]}`)
			}else{
				break
			}
		}

	mealEl.innerHTML = `
		<h1>${mealData.strMeal}</h1>
      <img
         src="${mealData.strMealThumb}"
         alt=""
      />
      <p>
         ${mealData.strInstructions}
      </p>
		<h3>Ingredients:</h3>
       <ul>
		 ${ingredients.map(ing => `
		 <li>${ing}</li>
		 `).join("")}
		 </ul>
	`
	mealInfoEl.appendChild(mealEl)
	// show the popup
	MealPopup.classList.remove('hidden')
}



searchBtn.addEventListener('click', async () => {
	// clean container
	mealsEl.innerHTML = '';
	const search = SearchTerm.value;

	const meals = await getMealsBySearch(search);

	if(meals){
		meals.forEach(meal => {
			addMeal(meal)
		});
	}
})


PopupcloseBtn.addEventListener('click', ()=>{
	MealPopup.classList.add('hidden')

})