let changeThemeBtn = document.querySelector(".themeChange") 
let body =document.querySelector("body") 
changeThemeBtn.addEventListener("click", changeTheme) 
 
if(localStorage.getItem("theme") == "dark"){ 
  changeThemeBtn.classList.add("darkTheme") 
  body.classList.add("dark") 
} 
 
function changeTheme(){ 
  if(localStorage.getItem("theme") == "dark"){ 
    changeThemeBtn.classList.toggle('darkTheme') 
    body.classList.toggle("dark") 
    localStorage.setItem("theme", "whte") 
  }else{ 
    changeThemeBtn.classList.toggle('darkTheme') 
    body.classList.toggle("dark") 
    localStorage.setItem("theme", "dark") 
  } 
} 
 
let searchBtn = document.querySelector(".search button") 
searchBtn.addEventListener("click", searchMovie) 
 
let loader = document.querySelector('.loader') 
 
 
document.addEventListener('keydown', function(event){ 
  if(event.key === 'Enter'){ 
    event.preventDefault() 
    searchMovie() 
  } 
}) 
 
function searchMovie(){ 
  loader.style.display = "block" 
 
  let searchText = document.querySelector(".search input").value 
  console.log(searchText); 
   
}