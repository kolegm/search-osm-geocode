/**
 * [Doc Google API](http://wiki.openstreetmap.org/wiki/Nominatim)
 *
 */

//var util = require('util');
var _ = require('underscore');

function Parser() {}

module.exports.parseData = function (data) {
  return data;
};

module.exports.parseError = function (error) {
  if (error && _.isObject(error)) {
    switch (error.code) {
      case 'ENOTFOUND':
        error.message = 'Connection refused.';
        break;
    }
  }
  return error;
};
