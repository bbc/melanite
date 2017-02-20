'use strict'
const score = require('levenshtein-edit-distance')
const {all, any, not, compose, curry,
      pluck, filter, map, values, invertObj} = require('ramda')

// includesAll :: String -> [String] -> Boolean
const includesAll = (haystack, needles) =>
  all((needle) => haystack.includes(needle), needles)

// includesAny :: String -> [String] -> Boolean
const includesAny = (haystack, needles) =>
  any((needle) => haystack.includes(needle), needles)

// hasInvariants :: ua -> matcher -> bool
const hasAllInvariants = (ua, deviceMatcher) => {
  if (deviceMatcher.invariants && deviceMatcher.invariants.length) {
    return includesAll(ua, deviceMatcher.invariants)
  } else {
    return false
  }
}

// hasDisallowed :: ua -> matcher -> bool
const hasDisallowed = (ua, deviceMatcher) => {
  if (deviceMatcher.disallowed && deviceMatcher.disallowed.length) {
    return includesAny(ua, deviceMatcher.disallowed)
  } else {
    return false
  }
}

// noDisallowed :: ua -> matcher -> bool
const hasNoDisallowed = compose(not, hasDisallowed)

const validators = [hasAllInvariants, hasNoDisallowed]

// isValidFor :: ua -> matcher -> [matcher] -> [matcher]
const isValidFor = curry((ua, deviceMatcher) =>
  all((f) => f(ua, deviceMatcher), validators))

// matchCandidateDevices :: ua -> [matcher] -> [matcher]
const matchCandidateDevices = (ua, matchers) =>
  filter(isValidFor(ua), matchers)

// findBestMatch :: ua -> [matcher] -> device
const findBestMatch = curry((ua, matches) => {
  const fuzzies = pluck('fuzzy', matches)
  const scores = map((fuzzy) => score(ua, fuzzy), fuzzies)

  const bestScoreIndex = Math.min(...values(scores))
  const matchesInverted = invertObj(scores)
  const device = matchesInverted[bestScoreIndex] || 'generic-device'

  const brandModel = device.split('-')

  return {brand: brandModel[0], model: brandModel[1]}
})

// bestMatch :: [matcher] -> ua -> device
module.exports = curry((matchers, ua) => {
  const matches = matchCandidateDevices(ua, matchers)
  return findBestMatch(ua, matches)
})
