// ===== Scroll Button =====
const scrollBtn = document.querySelector(".window-scroll");

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// ===== Data management =====
const itemsContainer = document.querySelector(".letest-items");
const searchInput = document.getElementById("search");

const view = document.querySelector(".view");
const closeBtn = document.querySelector(".close-btn");

const modalImg = document.querySelector(".view img");
const modalTitle = document.querySelector(".view .card-title");
const modalText = document.querySelector(".view p");

let allData = [];

// ===== Fetch meals =====
async function fetchMeals() {
  itemsContainer.innerHTML = "<p class='text-center'>Loading...</p>";
  const apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

  try {
    const res = await axios.get(apiUrl);
    allData = res.data.meals || [];
    renderMeals(allData);
  } catch (error) {
    itemsContainer.innerHTML =
      "<p class='text-center text-danger'>Failed to load data</p>";
  }
}

// ===== Render meals =====
function renderMeals(data) {
  itemsContainer.innerHTML = "";

  if (data.length === 0) {
    itemsContainer.innerHTML =
      "<p class='text-center'>No Recipe Found</p>";
    return;
  }

  data.forEach((meal, index) => {
    itemsContainer.innerHTML += `
      <div class="col-lg-3 col-md-4 col-12">
        <div class="card h-100">
          <img src="${meal.strMealThumb}" class="card-img-top" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${meal.strMeal}</h5>
            <p class="card-text">
              ${truncateText(meal.strInstructions, 100)}
            </p>
            <button 
              class="btn btn-warning mt-auto view-content"
              data-index="${index}">
              VIEW DETAILS
            </button>
          </div>
        </div>
      </div>
    `;
  });

  attachViewEvents();
}

// ===== Truncate text =====
function truncateText(text, limit) {
  return text.length > limit ? text.slice(0, limit) + "..." : text;
}

// ===== View modal =====
function attachViewEvents() {
  document.querySelectorAll(".view-content").forEach(btn => {
    btn.addEventListener("click", () => {
      const meal = allData[btn.dataset.index];

      modalImg.src = meal.strMealThumb;
      modalTitle.innerText = meal.strMeal;
      modalText.innerText = meal.strInstructions;

      view.style.opacity = "1";
      view.style.pointerEvents = "auto";
    });
  });
}

// ===== Close modal =====
closeBtn.addEventListener("click", () => {
  view.style.opacity = "0";
  view.style.pointerEvents = "none";
});

// ===== Search =====
searchInput.addEventListener("input", e => {
  const query = e.target.value.toLowerCase().trim();

  const filteredData = allData.filter(meal =>
    meal.strMeal.toLowerCase().includes(query)
  );

  renderMeals(filteredData);
});

// ===== On load =====
window.onload = fetchMeals;
