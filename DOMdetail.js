document.addEventListener("DOMContentLoaded", () => {
  const latestDetail = sessionStorage.getItem("latestDetail")
  if (latestDetail) {
    displayDetail(JSON.parse(latestDetail))
  } else {
    catchDetail()
  }
})



const detailsContainer = document.querySelector(".FilmDetails")
async function catchDetail() {
  const contentId = sessionStorage.getItem("imdbID")
  sessionStorage.removeItem("imdbID")
  if (contentId) {
    const searchFilm = new SearchFilm()
    const loadingSpiner = document.createElement("div")
    loadingSpiner.classList.add("loadingSpiner")
    detailsContainer.appendChild(loadingSpiner)
    try {
      const details = await searchFilm.getDetail(contentId)
      displayDetail(details)
    } catch (e) {
      throw e
    }
  }
  
  
}

function displayDetail(details) {
  detailsContainer.innerHTML = ""
  let out = ""
  if (details.Actors !== "N/A") {
    const actorsList = details.Actors.split(",")
    
    for (let i = 0; i < actorsList.length; i++) {
      out += `<li>${actorsList[i]}</li>`
    }
    
  }
  
  const filmDetailContent = `
          <div class="miniature">
            <img src="${details.Poster}" alt="poster" loading="lazy" />
          </div>
          <details>
            <summary>
              Voir la description du film
            </summary>
            <p>${details.Plot}</p>
          </details>
          
          <div class="namely">
            <h1>À savoir</h1>
            <p class="title">Titre : <span>${details.Title}</span></p>
            <p class="year">Depuis : <span>${details.Year}</span></p>
            <p class="released">Sortie : <span>${details.Released}</span></p>
            <p class="runtime">Durée : <span>${details.Runtime}</span></p>
            <p class="genre">Genre : <span>${details.Genre}</span></p>
          </div>
          
          <br />
          <div class="author">
            <h1>Auteurs</h1>
            <p class="director">directeur : <span>${details.Director}</span> </p>
            <p class="writer">écrivain : <span>${details.Writer}</span> </p>
            <br />
            <h2>Acteurs :</h2>
            <ol class="actors">
              ${out}
            </ol>
          </div>
          
          <div class="otherInfo">
            <h1>Autres infos</h1>
            <p class="language">langue : <span>${details.Language}</span> </p>
            <p class="country">pays: <span>${details.Country}</span> </p>
          </div>
          <br />
          <div class="ratingAndSource">
            <h1>Note et Source</h1>
            <p class="rating">Note: <span>${details.Ratings[0]?.Value}</span> </p>
            <p class="webSite">Voir ce film ici :<a href="${details.Website || " #"}">${details.Website}</a></p>
          </div>
          
      `
  
  detailsContainer.innerHTML = filmDetailContent
}