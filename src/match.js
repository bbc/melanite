'use strict'
const score = require('levenshtein-edit-distance')
const {filter, map, values, invertObj} = require('ramda')

// matchCandidateDevices :: Matcher -> ua -> Matcher
const matchCandidateDevices = (matchers, ua) =>
  filter(function (deviceMatcher) {
    const disallowed = deviceMatcher.disallowed.reduce(function (acc, needle) {
      return acc || ua.includes(needle)
    }, false)
    const invariant = deviceMatcher.invariants.reduce(function (acc, needle) {
      return acc && ua.includes(needle)
    }, true)
    return invariant && !disallowed
  }, matchers)

// findBestMatch :: Matcher -> ua -> Device | null
const findBestMatch = (matches, ua) => {
  const fuzzies = map((m) => m.fuzzy, matches)
  const scores = map((fuzzy) => score(ua, fuzzy), fuzzies)

  const bestScoreIndex = Math.min.apply({}, values(scores))
  const matchesInverted = invertObj(scores)
  const device = matchesInverted[bestScoreIndex]

  if (!device) { return null }

  const brandModel = device.split('-')

  return {brand: brandModel[0], model: brandModel[1]}
}

// bestMatch :: Matcher -> ua -> Device
module.exports = (matchers) => (ua) => {
  const candidateDevices = matchCandidateDevices(matchers, ua)
  return findBestMatch(candidateDevices, ua)
}
