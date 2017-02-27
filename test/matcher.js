/* globals describe it beforeEach */
const {expect} = require('chai')
const {match} = require('../')

describe('Device Matching', () => {
  let testData
  let matchUserAgents
  beforeEach(() => {
    testData = [{
      brand: 'flux',
      model: 'profesh',
      invariants: [ 'Mozzarella', 'ultron' ],
      disallowed: [],
      fuzzy: 'Mozzarella reinstall flashy ultron; 81648/ii/AMD t0p_kek123; powered_by_NASA'
    }, {
      brand: 'google',
      model: 'chrome',
      invariants: [ 'Chrome' ],
      disallowed: [ 'Firefox' ],
      fuzzy: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36'
    }]
    matchUserAgents = match(testData)
  })
  it('Finds the correct device', function () {
    const chromeUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
    const madeupDeviceUa = 'Mozzarella file box goodle ultron'

    expect(matchUserAgents(chromeUA)).to.deep.equal({brand: 'google', model: 'chrome'})
    expect(matchUserAgents(madeupDeviceUa)).to.deep.equal({brand: 'flux', model: 'profesh'})
  })
  it('Returns generic device if the device is not found', () => {
    const modifiedFirefoxUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS Y 10.11; rv:50.0) Gecko/20100101 Firefox/50.0 Chromelike but not/Safari/536.36'
    expect(matchUserAgents(modifiedFirefoxUA)).to.deep.equal({brand: 'generic', model: 'device'})
  })
})
