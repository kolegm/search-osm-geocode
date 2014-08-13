var util = require('util');
var communicator = require('./');

const ADDRESS = process.argv[2] || 'Norway, Alesund';
const LATITUDE = '62.471872';
const LONGITUDE = '6.149655';
const LANGUAGE = 'en';

var options = {
  "accept-language": LANGUAGE
};

function callback (error, result) {
  if (error) console.log(error);
  else console.log(util.inspect(result, {depth: 5}));
}

communicator.geocode(ADDRESS, callback, options);

//communicator.reverseGeocode(LATITUDE, LONGITUDE, callback, options);
