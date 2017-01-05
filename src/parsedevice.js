const {curry, length, split} = require('ramda')

module.exports = curry((folder, fileName) => {
  const identifiers = require(fileName)
  const brandModelPath = fileName.substring(length(folder) + 1, fileName.indexOf('.json'))
  const brandModel = split('/', brandModelPath)

  const device = Object.assign({
    brand: brandModel[0],
    model: brandModel[1]
  }, identifiers)
  return device
})
