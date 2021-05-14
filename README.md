# melanite
Convert a user-agent to a normalised device.

# Installation
`npm install --save melanite`

# Usage

## Getting started
In order to use `melanite`, you need to provide one or more
"matchers"; a matcher represents a device you wish to identify. Below
is an example matcher that could be used to identify a Microsoft Xbox
One device:
```json
{
  "brand": "microsoft",
  "model": "xbox-one",
  "invariants": [
    "Xbox One"
  ],
  "disallowed": [],
  "fuzzy": "Mozilla/5.0(Windows NT 10.0; Win64; x64; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063",
  "type": "tv"
}
```

Let's take a look at each component of a matcher (all of which are
mandatory).

#### `brand`
The brand of the device; it serves no purpose for
identification and is merely a friendly name group several different
devices (e.g. by manufacturer)

#### `model`
The model of the device; like `brand`, it serves no purpose for
identification and is instead a friendly name for a specific device.

#### `invariants`
`invariants` is an array of strings (each of these is referred to as
an invariant); in order for a user agent to be matched to this
matcher, it **must** contain every invariant (similar to an allowlist).

#### `disallowed`
`disallowed` is an array of strings, it is in the opposite of
`invariants`. In order for a user agent to be matched to this matcher,
it **must not** contain any of these strings (similar to a denylist).

In the above example, we haven't specified any disallowed items. The
`disallowed` property is most useful when you have two or more
matchers that are very similar to each other.

##### `fuzzy`
`fuzzy` can be thought of as an example user agent. When a group of
matchers have been filtered using `invariants` and `disallowed`,
`melanite` calculates the
[Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance)
between the `fuzzy` and the user-agent - the matcher with the lowest
Levenshtein distance is the one returned by `melanite`.

#### `type`
The type of the device; like `brand` and `model`, it serves no purpose
for identification.

## Identifying devices
Now that we have a matcher, let's use it to identify some user agents:
```javascript
const melanite = require('melanite')

const userAgents = [
  'Mozilla/5.0(Windows NT 10.0; Win64; x64; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.713.12 Safari/57.36 Edge/15.4063',
  Some very strange user agent that we do not know about'
]

const matchers = [
  {
    "brand": "microsoft",
    "model": "xbox-one",
    "invariants": [
	  "Xbox One"
    ],
    "disallowed": [],
    "fuzzy": "Mozilla/5.0(Windows NT 10.0; Win64; x64; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063",
    "type": "tv"
  }
]

const identifyDevice = melanite.match(matchers)

const devices = userAgents.map((userAgent) => identifyDevice(userAgent))

console.log(devices)
/*
[
  { brand: 'microsoft', model: 'xbox-one', type: 'tv' },
  { brand: 'generic', model: 'device', type: 'unknown' }
]
*/
```

For a further example, please see [`example.js`](./example.js).
