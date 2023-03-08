module.exports = {
    getToken: getToken,
    setToken: setToken,
    logHeaders: logHeaders
  }

  let tokenList = []

  function setToken(requestParams, context, events, next) {
    tokenList.push(requestParams.accessToken)
    next(); // MUST be called for the scenario to continue
  }

  function getToken(requestParams, context, events, next){
    //idx = 0~500
    let idx = Math.floor(Math.random() * 500)
    context.vars.accessToken = tokenList[idx]
  }
  
  function logHeaders(requestParams, response, context, events, next) {
    console.log(response.headers);
    return next(); // MUST be called for the scenario to continue
  }