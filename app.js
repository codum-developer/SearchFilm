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
  
  async requestFilm(url) {
    const APIKEY = "3c8c985a"
    try {
      const result = await this.api.get(`?apikey=${APIKEY}&${url}`)
      if (!result.Search) {
        if (result.Response == "False") {
          displayResult(result, true)
          return
        }
      }
      sessionStorage.removeItem("latestResults")
      sessionStorage.setItem("latestResults", JSON.stringify(result))
      displayResult(result, false)
      return
    } catch (e) {
      displayResult(e, true)
      return
    }
    
  }
  
  async getDetail(contentID) {
    try {
      const data = await this.api.get(`/?apikey=3c8c985a&i=${contentID}`)
      sessionStorage.removeItem("latestDetail")
      sessionStorage.setItem("latestDetail", JSON.stringify(data))
      return data
    } catch (e) {
      throw e
    }
    
  }
}