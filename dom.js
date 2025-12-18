const searchFilm = new SearchFilm()

document.addEventListener("DOMContentLoaded", () => {
  sessionStorage.removeItem("latestDetail")
  const savedSearch = sessionStorage.getItem("latestResults")
  if (savedSearch) {
    displayResult(JSON.parse(savedSearch))
  }
  
  // gere le bouton go-up
  const goUpButton = document.querySelector(".go-up")
  window.addEventListener("scroll", () => {
    if (window.scrollY > window.innerHeight) {
      goUpButton.style.display = "flex"
    } else goUpButton.style.display = "none"
  })
  
  goUpButton.addEventListener("click", () => window.scrollTo(0, 0))
  
  
  createFloatDot()
  
  
  
})

const searchContainer = document.querySelector(".search")
const resultContainer = document.querySelector(".result")
const searchInput = document.getElementById("searchInput")
const searchForm = document.querySelector(".search")
const filterInputs = document.querySelectorAll(".filter-input")
searchForm.addEventListener("submit", (e) => {
  e.preventDefault()
  if (searchInput.value !== "") {
    startSearching()
  }
})



async function startSearching(pageNumber = 1) {
  resultContainer.innerHTML = ""
  const loadingSpiner = document.createElement("div")
  loadingSpiner.classList.add("loadingSpiner")
  resultContainer.appendChild(loadingSpiner)
  
  let filterToApply = ""
  filterInputs.forEach(filter => {
    if (filter.value !== "none") {
      if (filter.value !== "") {
        filterToApply += `&${filter.name}=${filter.value}`
      }
    }
  })
  const cleanedInput = searchFilm.cleanInput(searchInput.value)
  const url = `s=${cleanedInput}${filterToApply}&page=${pageNumber}`
  await searchFilm.requestFilm(url)
  return
  
  
}





const skipPageWrapper = document.querySelector(".skip-age")
const skipPageButton = Array.from(skipPageWrapper.children)
skipPageButton.forEach(child => {
  child.addEventListener("click", nextPrevPage)
})
let pageNumber = 1

function nextPrevPage(e) {
  if (e.target.name === "nextButton") {
    pageNumber++
  } else if (e.target.name === "prevButton") {
    pageNumber--
  }
  if (pageNumber < 1) {
    pageNumber = 1
    return
  }
  startSearching(pageNumber)
  return
}


function displayResult(data, err) {
  resultContainer.innerHTML = ""
  //searchContainer.classList.add("searchEnd")
  const resultLenEl = document.querySelector(".resultLen")
  const resultsLen = document.getElementById("resultLen")
  if (err) {
    const errContent = `
        <p class="contentErr">${data.Error || data.message}</p>
          `
    resultsLen.textContent = `0`
    const errContainer = document.createElement("div")
    errContainer.classList.add("err")
    errContainer.innerHTML = errContent
    resultContainer.appendChild(errContainer)
    return
  }
  
  resultsLen.textContent = `${data.Search.length}`
  resultLenEl.style.display = "block"
  const resultList = data.Search
  resultList.forEach(film => {
    const filmContainersContent = `
            <img src="${film.Poster}" alt="affiche" class=""  loading="lazy"/>
            <div class="filmDetail">
              <p class="title">${film.Title}</p>
              <p class="year">Sortie: ${film.Year}</p>
              <p class="type">Type: ${film.Type}</p>
            </div>
          
          `
    const filmContainers = document.createElement("div")
    filmContainers.classList.add("filmContainer")
    filmContainers.innerHTML = filmContainersContent
    resultContainer.appendChild(filmContainers)
  })
  
  skipPageWrapper.style.display = "flex"
  const boxes = document.querySelectorAll(".filmContainer")
  boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
      sessionStorage.setItem("imdbID", resultList[index].imdbID)
      window.location.href = "./details.html"
      return
    })
  })
}





function createFloatDot() {
  const dotContainer = document.querySelector(".dot-container")
  
  
  const dotCount = 50
  
  
  
  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement("div")
    dot.className = "dot"
    
    const size = Math.random() * 5 + 2
    const left = Math.random() * 100
    const top = Math.random() * 100
    const animationDuration = Math.random() * 20 + 10
    const animationDelay = Math.random() * 5
    const opacity = Math.random() * 0.8 + 0.2
    
    const dotStyle = {
      width: `${size}px`,
      height: `${size}px`,
      left: `${left}%`,
      top: `${top}%`,
      animationDuration: `${animationDuration}s`,
      animationDelay: `${animationDelay}s`,
      opacity: opacity
    }
    
    Object.assign(dot.style, dotStyle)
    dotContainer.appendChild(dot)
  }
  
}