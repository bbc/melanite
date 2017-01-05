/* globals describe it */
const {expect} = require('chai')
const {match, loadDevices, loadDevicesSync} = require('../')

describe('Config Spec', () => {
  describe('Promise loaded devices', () => {
    const deviceFilesPromise = loadDevices()
    it('Has properly defined device files', (done) => {
      deviceFilesPromise
        .then(schemaCheck)
        .then(done)
        .catch(done)
    })
    it('Correctly identifies the known devices', (done) => {
      deviceFilesPromise
        .then(identifiedDevices)
        .then(done)
        .catch(done)
    })
    it('Correctly identifies the known devices when user agents are fuzzed', (done) => {
      deviceFilesPromise
        .then(identifiedDevicesFuzzed)
        .then(done)
        .catch(done)
    })
    it('Correctly does not identify the known devices when invariants are removed', (done) => {
      deviceFilesPromise
        .then(invariantsRemoved)
        .then(done)
        .catch(done)
    })
    it('Correctly does not identify the known devices when disallowed segments are added', (done) => {
      deviceFilesPromise
        .then(disallowedAdded)
        .then(done)
        .catch(done)
    })
  })

  describe('Sync loaded devices', () => {
    const listOfDevices = loadDevicesSync()
    it('Has properly defined device files', () => {
      schemaCheck(listOfDevices)
    })
    it('Correctly identifies the known devices', () => {
      identifiedDevices(listOfDevices)
    })
    it('Correctly identifies the known devices when user agents are fuzzed', () => {
      identifiedDevicesFuzzed(listOfDevices)
    })
    it('Correctly does not identify the known devices when invariants are removed', () => {
      invariantsRemoved(listOfDevices)
    })
    it('Correctly does not identify the known devices when disallowed segments are added', () => {
      disallowedAdded(listOfDevices)
    })
  })
})

function schemaCheck (listOfDevices) {
  listOfDevices.forEach((device) => {
    const {brand, model, invariant, disallowed, fuzzy} = device
    expect(device, `${brand}-${model}`).to.have.property('brand')
    expect(device, `${brand}-${model}`).to.have.property('model')
    expect(device, `${brand}-${model}`).to.have.property('invariant')
    expect(device, `${brand}-${model}`).to.have.property('disallowed')
    expect(device, `${brand}-${model}`).to.have.property('fuzzy')
    expect(brand).to.be.a('string')
    expect(model).to.be.a('string')
    expect(invariant).to.be.a('array')
    expect(disallowed).to.be.a('array')
    expect(fuzzy).to.be.a('string')
  })
}

function identifiedDevices (listOfDevices) {
  const matchMyKnownDevices = match(listOfDevices)
  listOfDevices.forEach(({fuzzy, brand, model, invariant, disallowed}) => {
    const identifiedDevice = matchMyKnownDevices(fuzzy)
    expect(identifiedDevice.brand).to.equal(brand)
    expect(identifiedDevice.model).to.equal(model)
  })
}

function identifiedDevicesFuzzed (listOfDevices) {
  const matchMyKnownDevices = match(listOfDevices)
  listOfDevices.forEach(({fuzzy, brand, model, invariant, disallowed}) => {
    const identifiedDevice3 = matchMyKnownDevices(fuzzieafy(fuzzy, invariant, disallowed, 3))
    expect(identifiedDevice3.brand).to.equal(brand)
    expect(identifiedDevice3.model).to.equal(model)

    const identifiedDevice1Dollar = matchMyKnownDevices(fuzzieafy(fuzzy, invariant, disallowed, 1, '$'))
    expect(identifiedDevice1Dollar.brand).to.equal(brand)
    expect(identifiedDevice1Dollar.model).to.equal(model)

    const identifiedDevice2Dagger = matchMyKnownDevices(fuzzieafy(fuzzy, invariant, disallowed, 2, '†'))
    expect(identifiedDevice2Dagger.brand).to.equal(brand)
    expect(identifiedDevice2Dagger.model).to.equal(model)

    const identifiedDevice3Star = matchMyKnownDevices(fuzzieafy(fuzzy, invariant, disallowed, 3, '*'))
    expect(identifiedDevice3Star.brand).to.equal(brand)
    expect(identifiedDevice3Star.model).to.equal(model)
  })
}

function invariantsRemoved (listOfDevices) {
  const matchMyKnownDevices = match(listOfDevices)
  listOfDevices.forEach(({fuzzy, brand, model, invariant, disallowed}) => {
    const identifiedDevice = matchMyKnownDevices(removeStrings(fuzzy, invariant))

    expect(identifiedDevice.brand).not.to.equal(brand)
    expect(identifiedDevice.model).not.to.equal(model)
    expect(identifiedDevice.brand).to.equal('generic')
    expect(identifiedDevice.model).to.equal('device')
  })
}

function disallowedAdded (listOfDevices) {
  const matchMyKnownDevices = match(listOfDevices)
  listOfDevices
    .filter(({disallowed}) => disallowed.length > 0)
    .forEach(({fuzzy, brand, model, invariant, disallowed}) => {
      const identifiedDevice = matchMyKnownDevices(addStrings(fuzzy, disallowed))
      expect(identifiedDevice.brand).not.to.equal(brand)
      expect(identifiedDevice.model).not.to.equal(model)
      expect(identifiedDevice.brand).to.equal('generic')
      expect(identifiedDevice.model).to.equal('device')
    })
}
/**
 * This is quite a naïve implementation.
 * There are plenty of cases it misses,
 * such as where HELLO and WORLD must be
 * present in the string but HELLOWORLD
 * is a disallowed, for example.
 * It also only pads from the end, things
 * like that etc.
 */
function fuzzieafy (userAgent, invariants, disalloweds, padLength = 0, padChar = '_') {
  expect(padLength).to.be.above(-1)
  const allInvariants = addStrings('', invariants)
  const fuzzed = allInvariants + padChar.repeat(userAgent.length - allInvariants.length + padLength)
  const allowedFuzzed = removeStrings(fuzzed, disalloweds, padChar)
  return allowedFuzzed
}

function removeStrings (userAgent, toRemoves, padChar = '_') {
  return toRemoves.reduce(function (acc, toRemove) {
    return acc.replace(new RegExp(toRemove, 'g'), padChar.repeat(toRemove.length))
  }, userAgent)
}

function addStrings (userAgent, toAdds) {
  return userAgent + toAdds.join(' ')
}

