/* globals describe it */
const {expect} = require('chai')

describe('example file', () => {
  let oldConsole
  it('console logs out the expected examples', function () {
    let loggedOut = []
    oldConsole = console.log
    console.log = function () {
      const args = Array.from(arguments)
      loggedOut.push(args)
    }
    require('../example')
    expect(loggedOut).to.deep.equal([
      ['google-chrome'],
      ['generic-device'],
      ['gamestick-streamer_2013'],
      ['generic-device'],
      ['generic-device']
    ]
    )
    console.log = oldConsole
  })
})
