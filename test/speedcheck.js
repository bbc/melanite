const {match} = require('../')
const testData = require('./testData.json')

const chromeUA = 'REAL CHROME Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
const madeupDeviceUa = 'Mozzarella file box goodle ultron'
const modifiedFirefoxUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS Y 10.11; rv:50.0) Gecko/20100101 Firefox/50.0 Chromelike but not/Safari/536.36'

console.time('whole')

console.time('setup')
const matchUserAgents = match(testData)
console.timeEnd('setup')

console.time('match')
console.time('chrome')
matchUserAgents(chromeUA)
console.timeEnd('chrome')
console.time('madeup')
matchUserAgents(madeupDeviceUa)
console.timeEnd('madeup')
console.time('fire')
matchUserAgents(modifiedFirefoxUA)
console.timeEnd('fire')
console.timeEnd('match')

console.timeEnd('whole')
