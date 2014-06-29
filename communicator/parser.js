/**
 * [Doc Google API](http://wiki.openstreetmap.org/wiki/Nominatim)
 * 
 */

var util = require('util');
var EventEmmitter = require('events').EventEmitter;

var parser;

function Parser() {}

util.inherits(Parser, EventEmmitter);

parser = new Parser();

parser.on('parse_error', function (error) {
  switch (error.code) {
    case 'ENOTFOUND':
      error.message = 'Connection refused';
      break;
  }
  return error;
});

parser.on('parse_data', function (data) {
  // @todo: check status, transform result to your format
  return data;
});

module.exports = parser;
