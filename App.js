const searchButton = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const wordCardsContainer = document.getElementById("wordCards");
const historyButton = document.getElementById("historyButton");

async function fetchWordMeaning(word) {
  const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  wordCardsContainer.innerHTML = "";
  try {
    const response = await fetch(apiUrl);
    const result = await response.json();

    const wordCard = createWordCard(result[0]);
    wordCardsContainer.appendChild(wordCard);

    const searches = JSON.parse(localStorage.getItem("searches")) || [];
    searches.push({ word, meaning: result[0].meanings[0].definitions[0].definition });
    localStorage.setItem("searches", JSON.stringify(searches));

  } catch (error) {
    console.error("Error fetching word meaning:", error);
  }
}
searchButton.addEventListener("click", searchWord);

function createWordCard(wordData) {
    // console.log("createWordCard called");

  const card = document.createElement("div");
  card.classList.add("word-card");

  const wordTitle = document.createElement("h3");
  wordTitle.textContent = "Word: " + wordData.word;

  const wordMeaning = document.createElement("p");
  wordMeaning.textContent = wordData.meanings[0].definitions[0].definition;

  card.appendChild(wordTitle);
  card.appendChild(wordMeaning);

  return card;
}
function searchWord() {
    // console.log("searchWord called");

    const word = searchInput.value.trim();
    if (word !== "") {
      fetchWordMeaning(word);
    }
  }

historyButton.addEventListener("click", function() {
  const main = document.querySelector("main");
  ;

  if (historyButton.innerText === "History") {
    main.innerHTML = "";
    showHistory();
    historyButton.innerText = "Search";
  } else {
    historyButton.innerText = "History";
    showSearch();
  }
});

function showHistory() {
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  const historyContainer = document.createElement("div");
  historyContainer.id = "historyContainer";

  for (const search of searches) {
    const historyCard = createHistoryCard(search);
    historyContainer.appendChild(historyCard);
  }

  const main = document.querySelector("#main");
  main.appendChild(historyContainer);
}

function showSearch() {
  const searchContainer = document.createElement("div");
  searchContainer.classList.add("search-container");
  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(searchButton);

  const wordCardsContainer = document.createElement("div");
  wordCardsContainer.classList.add("word-cards");
  wordCardsContainer.id = "wordCards";


  const main = document.querySelector("#main");
  main.innerHTML = ""; // Clear the main content

  main.appendChild(searchContainer);
  main.appendChild(wordCardsContainer);


  

}

function createHistoryCard(searchData) {
  const card = document.createElement("div");
  card.classList.add("history-card");

  const wordTitle = document.createElement("h3");
  wordTitle.textContent = "Word: " + searchData.word;

  const wordMeaning = document.createElement("p");
  wordMeaning.textContent = "Meaning: " + searchData.meaning;

  const deleteButton = document.createElement("i");
  deleteButton.classList.add("fa-solid", "fa-trash");
  deleteButton.id = "delete-icon"
  deleteButton.addEventListener("click", function() {
    deleteSearch(searchData.word);
    card.remove();
  });

  card.appendChild(wordTitle);
  card.appendChild(wordMeaning);
  card.appendChild(deleteButton);

  return card;
}

function deleteSearch(word) {
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  const updatedSearches = searches.filter(search => search.word !== word);
  localStorage.setItem("searches", JSON.stringify(updatedSearches));
}
