// Обработка смены темы
let changeThemeBtn = document.querySelector(".themeChange");
let body = document.querySelector("body");

changeThemeBtn.addEventListener("click", changeTheme);

// Установка темы при загрузке страницы
if (localStorage.getItem("theme") === "dark") {
  changeThemeBtn.classList.add("darkTheme");
  body.classList.add("dark");
}

function changeTheme() {
  if (localStorage.getItem("theme") === "dark") {
    changeThemeBtn.classList.remove('darkTheme');
    body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    changeThemeBtn.classList.add('darkTheme');
    body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
}

// Обработка поиска фильма
let searchBtn = document.querySelector(".search button");
if (searchBtn) {
  searchBtn.addEventListener("click", searchMovie);
}
let loader = document.querySelector('.loader');

// Обработка нажатия клавиши Enter
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchMovie();
  }
});

async function searchMovie() {
  loader.style.display = "block";

  let searchText = document.querySelector(".search input").value;
  console.log(searchText);

  try {
    let response = await sendRequest("https://www.omdbapi.com/", "GET", {
      "apikey": "e27bb7cc",
      "t": searchText
    });

    if (response.Response === "False") { 
      loader.style.display = "none";
      alert(response.Error);
    } else {
      let main = document.querySelector(".main");
      main.style.display = "block";
      
      let movieTitle = document.querySelector(".movieTitle h2");
      movieTitle.innerHTML = response.Title;

      let movieIMG = document.querySelector(".movieIMG");
      movieIMG.style.backgroundImage = `url(${response.Poster})`;

      let dataList = ["Actors", "Awards", "Country", "Director", "Genre", "Language", "Plot", "Released", "Runtime", "Type", "Writer", "imdbRating"];
      let movieInfo = document.querySelector(".movieInfo");
      movieInfo.innerHTML = "";

      dataList.forEach(param => {
        let value = response[param];
        let desc = `<div class="desc darckBg"> 
                      <div class="title">${param}</div> 
                      <div class="value">${value ? value : "N/A"}</div> 
                   </div>`;
        movieInfo.innerHTML += desc;
      });

      loader.style.display = "none";

      // Обновляем состояние кнопки "избранное"
      updateFavBtnState(response.imdbID);

      searchSimilarMovies(searchText);
    }
    console.log(response);
  } catch (error) {
    loader.style.display = "none";
    alert("Ошибка при выполнении запроса. Попробуйте позже.");
    console.error(error);
  }
}

// Обновление состояния кнопки "избранное"
function updateFavBtnState(imdbID) {
  let favBtn = document.querySelector('.movieInfo .favStar');
  if (favBtn) {
    const isFavorite = favs.some(fav => fav.imdbID === imdbID);
    if (isFavorite) {
      favBtn.classList.add("active");
    } else {
      favBtn.classList.remove("active");
    }
  }
}

// Поиск похожих фильмов
async function searchSimilarMovies(title) {
  try {
    let similarMovie = await sendRequest("https://www.omdbapi.com/", "GET", {
      "apikey": "e27bb7cc",
      "s": title
    });

    if (similarMovie.Response === "False") {
      document.querySelector(".similarMovieTitle h2").style.display = "none";
      document.querySelector(".similarMovie").style.display = "none";
    } else {
      document.querySelector(".similarMovieTitle h2").innerHTML = `Похожие фильмы: ${similarMovie.totalResults}`;
      showSimilarMovies(similarMovie.Search);
      console.log(similarMovie);
    }
  } catch (error) {
    alert("Ошибка при выполнении запроса. Попробуйте позже.");
    console.error(error);
  }
}

function showSimilarMovies(movies) {
  let similarMovie = document.querySelector(".similarMovie");
  let similarMovieTitle = document.querySelector(".similarMovieTitle h2");
  similarMovie.innerHTML = ""; 

  movies.forEach(movie => {
    let isFavorite = favs.some(fav => fav.imdbID === movie.imdbID);
    similarMovie.innerHTML += 
    `<div class="similarMovieCard" style="background-image:url(${movie.Poster})">
      <div class="favStar ${isFavorite ? 'active' : ''}" data-title="${movie.Title}" data-poster="${movie.Poster}" data-imdbID="${movie.imdbID}"></div>
      <div class="similarMovieText">${movie.Title}</div>
    </div>`;
  });

  similarMovie.style.display = "grid";
  similarMovieTitle.style.display = "block";
  activateFavBtns();
}

function activateFavBtns() { 
  document.querySelectorAll(".favStar").forEach((elem) => { 
    elem.addEventListener("click", addToFav); 
  }); 
}

function addToFav(event) { 
  let favBtn = event.target;
  let title = favBtn.getAttribute("data-title"); 
  let poster = favBtn.getAttribute("data-poster"); 
  let imdbID = favBtn.getAttribute("data-imdbID"); 
  console.log(favBtn);

  const index = favs.findIndex(obj => obj.imdbID === imdbID);

  if (index < 0) {
    let fav = {title, poster, imdbID};
    favs.push(fav);
    localStorage.setItem("favs", JSON.stringify(favs));
    favBtn.classList.add("active");
  } else {
    favs.splice(index, 1);
    localStorage.setItem("favs", JSON.stringify(favs));
    favBtn.classList.remove("active");
  }
}

let favs = localStorage.getItem("favs"); 
if(!favs){ 
  favs = []; 
  localStorage.setItem("favs", JSON.stringify(favs)); 
} else { 
  favs = JSON.parse(favs); 
} 

async function sendRequest(url, method, data) {
  if (method === "POST") {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    let responseData = await response.json();
    return responseData;
  } else if (method === "GET") {
    url = url + "?" + new URLSearchParams(data);
    let response = await fetch(url, {
      method: "GET"
    });

    let responseData = await response.json();
    return responseData;
  }
}

function showFavs() {
  let similarMovieContainer = document.querySelector(".similarMovie");
  let similarMovieTitle = document.querySelector(".similarMovieTitle h2");
  similarMovieContainer.innerHTML = "";
  similarMovieTitle.innerHTML = `Фильмы в избранном: ${favs.length}`;

  favs.forEach((movie) => {
    similarMovieContainer.innerHTML += 
    `<div class="similarMovieCard" style="background-image:url(${movie.poster})">
      <div class="favStar active" data-title="${movie.title}" data-poster="${movie.poster}" data-imdbID="${movie.imdbID}"></div>
      <div class="similarMovieText">${movie.title}</div>
    </div>`;
  });
  
  similarMovieContainer.style.display = "grid";
  similarMovieTitle.style.display = "block";
  activateFavBtns();
}
