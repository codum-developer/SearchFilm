class CircuitBreaker {
  constructor({ failureThreshold = 3, pauseTime = 5000 } = {}) {
    this.maxfailure = failureThreshold
    this.pauseTime = pauseTime
    this.state = "CLOSED"
    this.failures = 0
    this.lastAttempt = window.performance.now()
    
  }
  async call(action) {
    console.log(`Entrer dans le circuit, l'état est : ${this.state}`)
    if (this.state === "OPEN") {
      if ((performance.now() - this.lastAttempt) >= this.pauseTime) {
        console.log(performance.now() - this.lastAttempt)
        this.state = "HALF-OPEN"
        console.log(`État du circuit : ${this.state}`)
      } else {
        console.warn("Circuit OPEN , requête bloqué")
        throw new Error("requête bloqué")
      }
    }
    
    try {
      const data = await action()
      if (this.state === "HALF-OPEN") {
        this.failures = 0
        this.state = "CLOSED"
      }
      this.failures = 0
      return data
      
    } catch (e) {
      this.failures++
      this.lastAttempt = performance.now()
      if (this.state === "HALF-OPEN") {
        this.state = "OPEN"
        console.log(`après test l'état du circuit repasse à : ${this.state}`)
      }
      if (this.failures >= this.maxfailure) {
        this.state = "OPEN"
        console.log(`Le circuit passe à l'etat: ${this.state}`)
      }
      throw new Error(`Une erreur se produit dans le circuit ${e.message}`)
    }
    
  }
}

breaker = new CircuitBreaker()




class Api {
  constructor(baseURL, defaultOptions = { timeout: 1000 }, breaker = true) {
    this.baseUrl = baseURL
    this.defaultOptions = defaultOptions
    this.breaker = breaker
    
  }
  
  async request(endpoint, options = {}, retries = 5, baseDelay = 500) {
    const url = this.baseUrl + endpoint
    
    
    const finallyOptions = { ...this.defaultOptions, ...options }
    const timeout = finallyOptions.timeout || 10000
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController()
      const timer = setTimeout(() => { controller.abort() }, timeout)
      try {
        const res = await this._onRequest(url, { ...finallyOptions, signal: controller.signal })
        clearTimeout(timer)
        const data = await this._onResponse(res)
        return data
        
      } catch (e) {
        clearTimeout(timer)
        if (attempt === retries) {
          if (e.name === "AbortError") {
            throw this._onError("requête avorté")
          }
          throw this._onError(e)
        }
        
        
        const delay = this.getDelay(baseDelay, attempt)
        console.warn(`[API] Échec tentative ${attempt + 1}/${retries}. Réessai dans ${Math.round(delay)}ms.`);
        await new Promise((resolve) => setTimeout(resolve, delay))
        
        
      }
    }
    
  }
  
  getDelay(basedelay, attempt) {
    const exponential = basedelay * Math.pow(2, attempt)
    const jitter = exponential * (0.5 + Math.random() / 2)
    return jitter
  }
  
  async _onRequest(url, options) {
    //console.log(`request of: ${url} en cours`)
    if (this.breaker) {
      return breaker.call(async () => await fetch(url, options))
    } else {
      return await fetch(url, options)
    }
    
  }
  
  async _onResponse(response) {
    if (!response.ok) { throw new Error("erreur http " + response.status) }
    try {
      const data = await response.json()
      return data
    } catch (e) {
      throw this._onError(e)
    }
    
  }
  
  _onError(err) {
    return new Error(`${err}`)
  }
  
  get(endpoint, options) {
    return this.request(endpoint, { ...options, method: "GET" })
  }
  
  post(endpoint, data, options = {}) {
    const defaultOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    }
    const finallyOptions = { ...defaultOptions, ...options }
    return this.request(endpoint, finallyOptions)
    
  }
  
  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    })
  }
  patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    })
  }
  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" })
  }
  
  
  
}