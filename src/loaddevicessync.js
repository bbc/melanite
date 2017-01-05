const glob = require('glob')
const parseDevice = require('./parsedevice')

module.exports = () => {
  return glob.sync('../devices/**/*.json', {cwd: __dirname})
             .map(parseDevice('../devices'))
}
