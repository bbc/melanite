# melanite
---
User-Agent to TAL device identification.

For example usage see example.js

## API
```
melanite.match :: [matcher] -> userAgent -> device
```

Matcher:
```
[{
	brand: 'brand', // the brand of the device
	model: 'model', // the model name of the device
	invariant: [String], // substrings that will always be present
	disallowed: [String], // substrings that can never be present
	fuzzy: String // an example user agent that will be fuzzily matched, assuming that the invariants and disalloweds are met
}, {
	...
}]
```

Device:
```
{
	brand: String, // the brand of the device
	model: String, // the model name of the device
}
```
