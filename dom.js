const searchContainer = document.querySelector(".search")
const resultContainer = document.querySelector(".result")

function displayResult(data, err) {
  resultContainer.innerHTML = ""
  //searchContainer.classList.add("searchEnd")
  if (err) {
    const errContent = `
        <p class="contentErr">${data.Error || data.message}</p>
          `
    const errContainer = document.createElement("div")
    errContainer.classList.add("err")
    errContainer.innerHTML = errContent
    resultContainer.appendChild(errContainer)
    return
  }
  const resultLenEl = document.querySelector(".resultLen")
  const resultsLen = document.getElementById("resultLen")
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
  const boxes = document.querySelectorAll(".filmContainer")
  boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
      sessionStorage.setItem("imdbID",resultList[index].imdbID )
      window.location.href = "./details.html"
      return
    })
  })
}


function listenInputStartSearching() {
  const searchInput = document.getElementById("searchInput")
  const searchForm = document.querySelector(".search")
  
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    resultContainer.innerHTML = ""
    if (searchInput.value !== "") {
      const loadingSpiner = document.createElement("div")
      loadingSpiner.classList.add("loadingSpiner")
      resultContainer.appendChild(loadingSpiner)
      
      const searchFilm = new SearchFilm()
      const cleanedInput = searchFilm.cleanInput(searchInput.value)
      await searchFilm.requestFilm(cleanedInput)
    }
    return
    
  })
}



listenInputStartSearching()