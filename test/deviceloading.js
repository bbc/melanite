/* globals describe it beforeEach */
const {expect} = require('chai')
const {loadDevices, loadDevicesSync} = require('../')

describe('Device Loading', () => {
  describe('Sync loaded devices', () => {
    let deviceList
    beforeEach(() => {
      deviceList = loadDevicesSync()
    })
    it('Loads the listed devices', function () {
      expect(deviceList).to.be.a('array')
    })
  })
  describe('Promise loaded devices', () => {
    let deviceListPromise
    beforeEach(() => {
      deviceListPromise = loadDevices()
    })
    it('Loads the listed devices', function (done) {
      deviceListPromise
        .then((deviceList) => {
          expect(deviceList).to.be.a('array')
        })
        .then(done)
        .catch(done)
    })
    it('Loads the same list as sync loading', (done) => {
      deviceListPromise
        .then((deviceList) => {
          expect(deviceList).to.deep.equal(loadDevicesSync())
        })
        .then(done)
        .catch(done)
    })
  })
})

