// script.js
const apiUrl = "https://forkify-api.herokuapp.com/api/v2/recipes?search=";
function defaultFn() {
  const defaultFood = "chicken";
  searchFn(defaultFood);
}

document.getElementById("searchBtn").addEventListener("click", () => {
  const userIn = document.getElementById("searchInput").value.trim();
  if (userIn !== "") {
    searchFn(userIn);
  } else {
    alert("Please enter a recipe name.");
  }
});

document.addEventListener("click", (event) => {
  if (event.target.className === "show-recipe-btn") {
    const rId = event.target.getAttribute("data-id");
    modalFn(rId);
  }
  if (event.target.id === "closeBtn") {
    closeModalFn();
  }
});

defaultFn();

function searchFn(query) {
  const url = `${apiUrl}${query}`;
  fetch(url)
    .then((res) => res.json())
    .then((tmp) => {
      if (tmp.data.recipes && tmp.data.recipes.length > 0) {
        showRecpsFn(tmp.data.recipes);
      } else {
        noRecFn();
      }
    })
    .catch((error) => console.error("Error fetching recipes:", error));
}

function showRecpsFn(r) {
  const rCont = document.getElementById("recipeContainer");
  rCont.innerHTML = "";
  r.slice(0, 20).forEach((recipe) => {
    const c = document.createElement("div");
    c.classList.add("animate__animated", "animate__fadeIn", "recipe-card");
    c.innerHTML = `
			<h3>${recipe.title}</h3>
			<img src="${recipe.image_url}"
			alt="${recipe.title}">
			<p>Publisher: ${recipe.publisher}</p>
			<button class="show-recipe-btn"
			data-id="${recipe.id}">Show Recipe</button>
		`;

    rCont.appendChild(c);
  });
  if (r.length === 1) {
    const card = rCont.firstChild;
    card.style.margin = "auto";
  }
}

function noRecFn() {
  const rCont = document.getElementById("recipeContainer");
  rCont.innerHTML = "<p>No Recipe found</p>";
}

function modalFn(recipeId) {
  const mData = document.getElementById("modalContent");
  mData.innerHTML = "";
  fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${recipeId}`)
    .then((response) => response.json())
    .then((data) => {
      const rep = data.data.recipe;
      mData.innerHTML = `
				<h2>${rep.title}</h2>
				<img src="${rep.image_url}" alt="${rep.title}">
				<h3>Cooking Time: ${rep.cooking_time} minutes</h3>
				<h3>Servings: ${rep.servings}</h3>
				<h3>Ingredients:</h3>
				<ul>
					${rep.ingredients
            .map(
              (ing) =>
                `<li>${ing.quantity || ""} ${ing.unit || ""} ${
                  ing.description
                }</li>`
            )
            .join("")}
				</ul>
				<h3>Instructions:</h3>
				<p>${
          rep.source_url
            ? `<a href="${rep.source_url}" target="_blank">View full recipe</a>`
            : "Instructions not available"
        }</p>
			`;
      document.getElementById("recipeModal").style.display = "block";
    })
    .catch((error) => console.error("Error fetching recipe details:", error));
}

function formatFn(instructions) {
  return instructions
    .split("\r\n")
    .filter((instruction) => instruction.trim() !== "")
    .join("<br>");
}

function closeModalFn() {
  document.getElementById("recipeModal").style.display = "none";
}
