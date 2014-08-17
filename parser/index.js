/**
 * [Doc Open Street (OSM) Map service](http://wiki.openstreetmap.org/wiki/Nominatim)
 */

var _ = require('underscore');

function create() {
  return _.extend({}, require('./model.json'));
}

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
  var internal;
  var tagType;
  var tagClass;

  internal = create();

  if (!_.isEmpty(external)) {

    if (external.display_name) {
      internal.formatted = external.display_name;
    }

    if (external.address) {
      var address = external.address;

      if (address.country) {
        internal.country = address.country;
      }
      if (address.country_code) {
        internal.countryIso = address.country_code;
      }
      if (address.postcode) {
        internal.zipcode = address.postcode;
      }
      if (address.state) {
        internal.state = address.state;
      }
      if (address.county) {
        internal.area = address.county;
      } else if (address.state_district) {
        internal.area = address.state_district;
      }

      if (address.city) {
        internal.city = address.city;
      }
      else if (address.town) {
        internal.city = address.town;
      }
      else if (address.village) {
        internal.city = address.village;
      }
      else if (address.hamlet) {
        internal.city = address.hamlet;
      }

      if (address.city_district) {
        internal.subcity = address.city_district;
      }

      if (address.suburb) {
        internal.subcity1 = address.suburb;
      }

      if (address.locality) {
        internal.subcity2 = address.locality;
      }

      if (address.neighbourhood) {
        internal.neighborhood = address.neighbourhood;
      }

      if (address.road) {
        internal.streetName = address.road;
      }

      if (address.house_number) {
        internal.streetNumber = address.house_number;
      }

      if (address.address29) {
        internal.streetAddress = address.address29;
      }

      /**
       * Important for case when address has unknown subelement
       * and which presents as root tag value
       */
      tagType = external.type;
      tagClass = external.category;
      if (tagType && address[tagType] && !_.contains(internal, address[tagType])) {
        internal.place = address[tagType];
      }
      else if (tagClass && address[tagClass] && !_.contains(internal, address[tagClass])) {
        internal.place = address[tagClass];
      }
    }

    if (external.lat) {
      internal.latitude = external.lat;
    }
    if (external.lon) {
      internal.longitude = external.lon;
    }

    if (external.boundingbox) {
      var bb = external.boundingbox;

      var viewport = {
        leftTop: { latitude: null, longitude: null },
        rigthBottom: { latitude: null, longitude: null },
      }

      if (bb[0]) {
        viewport.leftTop.latitude = bb[0];
      }
      if (bb[1]) {
        viewport.leftTop.longitude = bb[1];
      }
      if (bb[2]) {
        viewport.rigthBottom.latitude = bb[2];
      }
      if (bb[3]) {
        viewport.rigthBottom.longitude = bb[3];
      }

      internal.viewport = viewport;
    }

  }

  return internal;
}
