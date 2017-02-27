'use strict'
const score = require('levenshtein-edit-distance')
const {all, any, not, compose, apply, curry, pluck} = require('ramda')

// includesAll :: String -> [String] -> Boolean
const includesAll = (haystack, needles) =>
  all((needle) => haystack.includes(needle), needles)

// includesAny :: String -> [String] -> Boolean
const includesAny = (haystack, needles) =>
  any((needle) => haystack.includes(needle), needles)

// hasInvariants :: ua -> matcher -> bool
const hasAllInvariants = (ua, deviceMatcher) => includesAll(ua, deviceMatcher.invariants)

// hasDisallowed :: ua -> matcher -> bool
const hasDisallowed = (ua, deviceMatcher) =>
  includesAny(ua, deviceMatcher.disallowed)

// noDisallowed :: ua -> matcher -> bool
const hasNoDisallowed = compose(not, hasDisallowed)

const validators = [hasAllInvariants, hasNoDisallowed]

// isValidFor :: ua -> matcher -> [matcher] -> [matcher]
const isValidFor = curry((ua, deviceMatcher) =>
  all((f) => f(ua, deviceMatcher), validators))

// matchCandidateDevices :: ua -> [matcher] -> [matcher]
const matchCandidateDevices = (ua, matchers) =>
  matchers.filter(isValidFor(ua))

// findBestMatch :: ua -> [matcher] -> device
const findBestMatch = curry((ua, matches) => {
  const best = apply(Math.min)
  const fuzzies = pluck('fuzzy', matches)
  const scores = fuzzies.map((fuzzy) => score(ua, fuzzy))
  const bestScoreIndex = scores.indexOf(best(scores))

  const device = matches[bestScoreIndex] || {brand: 'generic', model: 'device'}

  return {brand: device.brand, model: device.model}
})

// bestMatch :: [matcher] -> ua -> device
module.exports = curry((matchers, ua) => {
  const matches = matchCandidateDevices(ua, matchers)
  return findBestMatch(ua, matches)
})
