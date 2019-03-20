'use strict'
const score = require('levenshtein-edit-distance')
const ramda = require('ramda')

const all = ramda.all
const any = ramda.any
const not = ramda.not
const compose = ramda.compose
const apply = ramda.apply
const curry = ramda.curry
const pluck = ramda.pluck

// includesAll :: String -> [String] -> Boolean
const includesAll = function(haystack, needles){
  return all(function(needle) {return haystack.indexOf(needle)>=0}, needles)
}

// includesAny :: String -> [String] -> Boolean
const includesAny = function(haystack, needles){
  return any(function(needle) {return haystack.indexOf(needle)>=0}, needles)
}

// hasInvariants :: ua -> matcher -> bool
const hasAllInvariants = function(ua, deviceMatcher) {
  return includesAll(ua, deviceMatcher.invariants)
}

// hasDisallowed :: ua -> matcher -> bool
const hasDisallowed = function(ua, deviceMatcher) {
  return includesAny(ua, deviceMatcher.disallowed)
}

// noDisallowed :: ua -> matcher -> bool
const hasNoDisallowed = compose(not, hasDisallowed)

const validators = [hasAllInvariants, hasNoDisallowed]

// isValidFor :: ua -> matcher -> [matcher] -> [matcher]
const isValidFor = curry(function(ua, deviceMatcher) {
  return all(function(f) {return f(ua, deviceMatcher)}, validators)
})

// matchCandidateDevices :: ua -> [matcher] -> [matcher]
const matchCandidateDevices = function(ua, matchers) {
 return matchers.filter(isValidFor(ua))
}

// findBestMatch :: ua -> [matcher] -> device
const findBestMatch = curry(function(ua, matches) {
  const best = apply(Math.min)
  const fuzzies = pluck('fuzzy', matches)
  const scores = fuzzies.map(function(fuzzy) {return score(ua, fuzzy)})
  const bestScoreIndex = scores.indexOf(best(scores))

  const device = matches[bestScoreIndex] || {brand: 'generic', model: 'device', type: 'unknown'}

  return {brand: device.brand, model: device.model, type: device.type}
})

// bestMatch :: [matcher] -> ua -> device
module.exports = curry(function(matchers, ua) {
  const matches = matchCandidateDevices(ua, matchers)
  return findBestMatch(ua, matches)
})