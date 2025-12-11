const contentId = sessionStorage.getItem("imdbID")
sessionStorage.removeItem("imdbID")
const searchFilm = new SearchFilm()

async function catchDetail() {
  try {
    const details = await searchFilm.getDetail(contentId)
    console.log(details)
    displayDetail(details)
  } catch (e) {
    throw e
  }
  
}

function displayDetail(details) {
  const detailsContainer = document.querySelector(".FilmDetails")
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
          <br />
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
            <p class="director">directeur : ${details.Director}</p>
            <p class="writer">écrivain : ${details.Writer}</p>
            <br />
            <h2>Acteurs :</h2>
            <ol class="actors">
              ${out}
            </ol>
          </div>
          
          <div class="otherInfo">
            <h1>Autres infos</h1>
            <p class="language">langue : ${details.Language}</p>
            <p class="country">pays: ${details.Country}</p>
          </div>
          <br />
          <div class="ratingAndSource">
            <h1>Note et Source</h1>
            <p class="rating">Note: ${details.Ratings[0]?.Value}</p>
            <p class="webSite">Voir ce film ici :<a href="${details.Website || "#"}">Chercher ici</a></p>
          </div>
          
      `
      
      detailsContainer.innerHTML = filmDetailContent
}

catchDetail()