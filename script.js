// Theme Change
let changeThemeBtn = document.querySelector(".themeChange");
let body = document.querySelector("body");

changeThemeBtn.addEventListener("click", changeTheme);

if (localStorage.getItem("theme") === "dark") {
  changeThemeBtn.classList.add("darkTheme");
  body.classList.add("dark");
}

function changeTheme() {
  if (localStorage.getItem("theme") === "dark") {
    changeThemeBtn.classList.toggle('darkTheme');
    body.classList.toggle("dark");
    localStorage.setItem("theme", "white");
  } else {
    changeThemeBtn.classList.toggle('darkTheme');
    body.classList.toggle("dark");
    localStorage.setItem("theme", "dark");
  }
}

// Movie Search
let searchBtn = document.querySelector(".search button");
searchBtn.addEventListener("click", searchMovie);

let loader = document.querySelector('.loader');

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

  let response = await sendRequest("http://www.omdbapi.com/", "GET", {
    "apikey": "e27bb7cc",
    "t": searchText
  });

  if (response.Response == "False") { 
    loader.style.display = "none";
    alert(response.Error);
  } else {
    let main = document.querySelector(".main")
    main.style.display = "block"
    
    let movieTitle = document.querySelector(".movieTitle h2");
    movieTitle.innerHTML = response.Title;

    let movieIMG = document.querySelector(".movieIMG");
    movieIMG.style.backgroundImage = `url(${response.Poster})`;

    let dataList = ["Actors", "Awards", "Country", "Director", "Genre", "Language", "Plot", "Released", "Runtime", "Type", "Writer", "imdbRating"]
    let movieInfo = document.querySelector(".movieInfo")
    movieInfo.innerHTML = ""

    for(let i = 0; i < dataList.length; i++){
      let param = dataList[i]
      let desc = `<div class="desc darckBg"> 
                    <div class="title">${param}</div> 
                    <div class="value">${response[param]}</div> 
                 </div> `
      movieInfo.innerHTML = movieInfo.innerHTML + desc
      loader.style.display = "none";
    }
  }
  console.log(response);
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
