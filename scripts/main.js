// --- do not touch  ↓↓↓↓↓↓↓↓↓↓↓↓ ----------
const baseServerURL = `http://127.0.0.1:${
  import.meta && import.meta.env && import.meta.env.REACT_APP_JSON_SERVER_PORT
    ? import.meta.env.REACT_APP_JSON_SERVER_PORT
    : 9090
}`;
// --- do not touch  ↑↑↑↑↑↑↑↑↑↑↑↑ ----------

// ***** Constants / Variables ***** //
let mainSection = document.getElementById("data-list-wrapper");

let sortAtoZBtn = document.getElementById("sort-low-to-high");
let sortZtoABtn = document.getElementById("sort-high-to-low");

let fetchRecipesBtn = document.getElementById("fetch-recipes");

let filterLessThan50Btn = document.getElementById("filter-less-than-50");
let filterMoreThanEqual50Btn = document.getElementById(
  "filter-more-than-equal-50"
);

let loginUserUsername = document.getElementById("login-user-username");
let loginUserPassword = document.getElementById("login-user-passowrd");
let loginUserButton = document.getElementById("login-user");
let welcomeUsernameSpan = document.getElementById("welcome-username");

let editRecipeInputId = document.getElementById("edit-recipe-input-id");
let editRecipeInputPrice = document.getElementById("edit-recipe-input-price");
let editRecipeButton = document.getElementById("edit-recipe-button");

let recipeData = [];

let userAuthToken, userInfo;

document.addEventListener("DOMContentLoaded", () => {
  userAuthToken = localStorage.getItem("authToken");
  userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (userAuthToken && userInfo) {
    welcomeUsernameSpan.innerText = `${userInfo.username}`;
    fetchRecipeData();
  }
});

loginUserButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = loginUserUsername.value;
  const password = loginUserPassword.value;

  const userLoginData = { username, password };

  try {
    const response = await fetch(`${baseServerURL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userLoginData),
    });

    const data = await response.json();

    localStorage.setItem("userInfo", JSON.stringify(data.user));

    localStorage.setItem("authToken", data.accessToken);
    userAuthToken = data.accessToken;
    userInfo = data.user;

    welcomeUsernameSpan.innerText = `${userInfo.username}`;
    console.log(data);

    fetchRecipesBtn.addEventListener("click", () => {
      fetchRecipeData();
    });
  } catch (err) {
    console.error(err);
  }
});

const fetchRecipeData = async () => {
  try {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${baseServerURL}/recipes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    recipeData = data;

    recipe(data);

    // price low-to-high
    sortAtoZBtn.addEventListener("click", () => {
      const recipesortAtoZ = recipeData.sort((a, b) => a.price - b.price);
      recipe(recipesortAtoZ);
    });

    // price high-to-low
    sortZtoABtn.addEventListener("click", () => {
      const recipesortAtoZ = recipeData.sort((a, b) => b.price - a.price);
      recipe(recipesortAtoZ);
    });

    // price less than 250
    filterLessThan50Btn.addEventListener("click", () => {
      const recipeLessThan250 = recipeData.filter(
        (recipe) => recipe.price < 250
      );
      recipe(recipeLessThan250);
    });

    // price more than or equal to 250
    filterMoreThanEqual50Btn.addEventListener("click", () => {
      const recipeMoreThan250 = recipeData.filter(
        (recipe) => recipe.price >= 250
      );
      recipe(recipeMoreThan250);
    });

    // console.log(data);
  } catch (err) {
    console.error("Error fetching recipe data:", err.message);
  }
};

// creating Div
function CreateDiv(id, name, image, instructions, price) {
  let div = `
    <div class="card-list">
    <div class="card" data-id="${id}">
      <div class="card-image">
        <img src="${image}" alt="">
      </div>

      <div class="card-body">
        <h3 class="card-item card-title">${name}</h3>
        <div class="card-item card-description">${instructions}</div>
        <div class="card-item card-additional-info">${price}</div>
        <a href="#" data-id="${id}" data-name="${name}" class="card-item card-link" id="edit-btn">EDIT</a>
      </div>
    </div>
  </div>`;
  return div;
}

function recipe(data) {
  let recipeData = data.map((el) =>
    CreateDiv(el.id, el.name, el.image, el.instructions, el.price)
  );
  mainSection.innerHTML = recipeData.join("");
}
