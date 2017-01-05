const {loadDevices, match} = require('./')

const chrome = 'Mozilla/5.0 (Macintosh) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36'
const maybeAChrome = 'Asdf Jekul (123;456) Chrome ultra cool mode (stuff/v8)'
const gamestick = 'Dalvik/1.6.0 (Linux; U; Android 4.1.2; GameStick V1.0 Build/V1.03.04MX01_20130521)'
const almostGamestick = 'Dalvik/1.6.0 (Linux; GameStick)'
const whoKnows = 'never heard of it'

const uasToIdentify = [
  chrome,
  maybeAChrome,
  gamestick,
  almostGamestick,
  whoKnows
]
/*
 logs:
   'google-chrome',
   'generic-device',
   'gamestick-streamer_2013',
   'generic-device',
   'generic-device'
 */

loadDevices()
  .then(listOfDevices => {
    const matchMyKnownDevices = match(listOfDevices)
    return uasToIdentify
      .map(matchMyKnownDevices)
      .map(({brand, model}) => `${brand}-${model}`)
      .forEach((device) => console.log(device))
  })
  .catch(console.error)

// Alternatively using loadDevicesSync
// const {loadDevicesSync, match} = require('melanite')
// const listOfDevices = loadDevicesSync()
// const matchMyKnownDevices = match(listOfDevices)
// uasToIdentify
//   .map(matchMyKnownDevices)
// .map(({brand, model}) => `${brand}-${model}`)
// .forEach((device) => console.log(device))
