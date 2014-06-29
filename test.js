/**
 * @todo use mocha test
 */
var communicator = require('./index');

const ADDRESS = 'Kyiv, Khreshchatyk';
const LATITUDE = '50.45';
const LONGITUDE = '30.523';
const LANGUAGE = 'uk';

var options = {
  "accept-language": LANGUAGE
};

function callback (error, result) {
  if (error) console.log(error);
  else console.log(result);
}

communicator.geocode(ADDRESS, callback, options);

communicator.reverseGeocode(LATITUDE, LONGITUDE, callback, options);
