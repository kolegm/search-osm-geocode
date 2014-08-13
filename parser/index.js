/**
 * [Doc Open Street (OSM) Map service](http://wiki.openstreetmap.org/wiki/Nominatim)
 */

var _ = require('underscore');

var model = require('./model.json');

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

/**
 * Results
 * When the geocoder returns results, it places them within a (JSON) results array.
 * Even if the geocoder returns no results (such as if the address doesn't exist) it still returns an empty results array.
 */
module.exports.parseData = function (data) {
  var result = [];

  if (_.isObject(data) && !_.isEmpty(data)) {
    result = parse(data);
  }

  return result;
};

/**
 * Convert external data format to internal format
 */
function parse (externalHolder) {
  var internalHolder = [];
  var internal;

  if (_.isArray(externalHolder)) {
    _.each(externalHolder, function (external) {
      internal = convert(external);
      internalHolder.push(internal);
    });
  }
  return internalHolder;
}

function convert (external) {
  var internal = create();

  if (!_.isEmpty(external)) {

    if (external.display_name) {
      internal.formatted = external.display_name;
    }
  }
  
  return internal;
}

function create() {
  return _.extend({}, model);
}
