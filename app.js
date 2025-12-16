class SearchFilm {
  constructor() {
    this.baseURL = "http://www.omdbapi.com"
    this.api = new Api(this.baseURL, {}, false)
    this.map = new Map()
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
    let result = {};
    let err;
    try {
      if (this.map.has(url)) {
        const data = this.getInMap(url)
        result = {...data }
        
      }
      else {
        const req = await this.api.get(`?apikey=${APIKEY}&${url}`)
        result = {...req}
        console.log(Object.keys(result).length)
      }
    }
    catch (e) {
      err = e
    }
    finally {
      if (!result.Search) {
        if (result.Response == "False") {
          displayResult(result, true)
          return
        }
      }
      if (Object.keys(result).length > 0) {
        sessionStorage.removeItem("latestResults")
        sessionStorage.setItem("latestResults", JSON.stringify(result))
        this.setMap(url, result)
        displayResult(result, false)
        return
      } else {
        console.log("erreur attrapé")
        displayResult(err, true)
      }
      
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
  
  setMap(key, value) {
    if (!this.map.has(key)) {
      this.map.set(key, value)
      
    } else {
      console.log(key + " déjà existants")
    }
    
  }
  
  getInMap(key) {
    const data = this.map.get(key)
    console.log(data)
    return data
  }
  
}