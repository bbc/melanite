const loadSync = require('./loaddevicessync')

module.exports = () =>
  new Promise((resolve, reject) => resolve(loadSync()))
