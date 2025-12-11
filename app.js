/*
fetch("http://www.omdbapi.com/?i=tt0046442&apikey=3c8c985a")
.then(res => res.json())
.then(data =>{
  const img = document.createElement("img")
  img.src = data.Search[0].Poster
  document.body.appendChild(img)
})

//Poster




Title":"Toot, Whistle, Plunk and Boom","Year":"1953","Rated":"Approved","Released":"10 Nov 1953","Runtime":"10 min","Genre":"Animation, Short, Comedy","Director":"Ward Kimball, Charles Nichols","Writer":"Dick Huemer","Actors":"The Mellowmen Quartet, Loulie Jean Norman, Charlie Parlota","Plot":"A crash course on the history of Western musical instruments.","Language":"English","Country":"United States","Awards":"Won 1 Oscar. 2 wins total","Poster":"https://m.media-amazon.com/images/M/MV5BNzQ1NmZlZTYtM2ZiYS00MTVkLWI1MjItMWUzM2IyNmU0ZWE0XkEyXkFqcGc@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"7.1/10"}],"Metascore":"N/A","imdbRating":"7.1","imdbVotes":"1,587","imdbID":"tt0046442","Type":"movie","DVD":"N/A","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"}
Taper ici le film que tu veux rechercher
Rechercher










Search":[{"Title":"Aladin","Year":"2009","imdbID":"tt1227762","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BMTQxMjY4NzUyM15BMl5BanBnXkFtZTcwMDI4NTk5Mw@@._V1_SX300.jpg"},{"Title":"Aladin","Year":"1993","imdbID":"tt8641078","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BOTIzZDBlYmItMWZjYy00MTI3LTkyYmMtODc5MzJjOGUxN2EzXkEyXkFqcGdeQXVyODgyODIzNDc@._V1_SX300.jpg"},{"Title":"Aladin","Year":"1952","imdbID":"tt0172104","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BMTYzNTc1NDgzNl5BMl5BanBnXkFtZTcwMjIxNzAyMQ@@._V1_SX300.jpg"},{"Title":"Aladin dan Lampu Wasiat","Year":"1982","imdbID":"tt0334892","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BNzI4OGE1MTktMjkwYi00MzVmLTg5OTQtMzRkNmM2YTgzOTQ4XkEyXkFqcGc@._V1_SX300.jpg"},{"Title":"Aladin & Alakadam","Year":"2016–","imdbID":"tt6206488","Type":"series","Poster":"https://m.media-amazon.com/images/M/MV5BMDQ1Njc4MDYtNDRkNC00YzEyLWJjMWMtZmFhYWMzYTQwZGVmXkEyXkFqcGdeQXVyNjY5NTQyMTA@._V1_SX300.jpg"},{"Title":"Aladin","Year":"1975","imdbID":"tt1066401","Type":"movie","Poster":"N/A"},{"Title":"Aladin","Year":"1946","imdbID":"tt1690100","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BMDYxYzM0NTgtOGYzMC00Mzg2LTk1MzEtOWFiMDAwYmZjNThhXkEyXkFqcGdeQXVyNDUxNjc5NjY@._V1_SX300.jpg"},{"Title":"Aladin und Ali Baba: Geschichten aus 1001 Nacht?","Year":"2023","imdbID":"tt27819279","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BMWQwMzI2ODAtNDhkZS00MTkxLWI4OGQtMWE3MmZlZTcxOGVmXkEyXkFqcGc@._V1_SX300.jpg"},{"Title":"Aladin dengan Lampoe Wasiat","Year":"1941","imdbID":"tt30224159","Type":"movie","Poster":"N/A"},{"Title":"Aladin et la lampe merveilleuse","Year":"1901","imdbID":"tt1745657","Type":"movie","Poster":"N/A"}],"totalResults":"16","Response":"True"}

"Response":"False","Error":"Movie not found!"}
*/

class SearchFilm {
  constructor() {
    this.baseURL = "http://www.omdbapi.com"
    this.api = new Api(this.baseURL, {}, false)
  }
  
  cleanInput(input) {
    const baseInput = input
    const cleanedInput = input
      .trim()
      .split(" ")
      .filter(word => word !== " ")
      .join("+")
    
    
    return cleanedInput
  }
  
  async requestFilm(cleanedInput) {
    
    try {
      const result = await this.api.get(`/?apikey=3c8c985a&s=${cleanedInput}`)
      console.log(result.Search)
      if (!result.Search) {
        if (result.Response == "False") {
          displayResult(result, true)
          return
        }
      }
      
      displayResult(result, false)
      return
    } catch (e) {
      displayResult(e, true)
      console.log(e)
      return
    }
  }
  
  async getDetail(contentID) {
    try {
      return await this.api.get(`/?apikey=3c8c985a&i=${contentID}`)
    } catch (e) {
      throw e
    }
    
  }
}