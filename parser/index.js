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

    if (external.address) {
      if (external.address.country) {
        internal.country = external.address.country;
      }
      if (external.address.country_code) {
        internal.countryIso = external.address.country_code;
      }
      if (external.address.postcode) {
        internal.zipcode = external.address.postcode;
      }
      if (external.address.state) {
        internal.state = external.address.state;
      }
      if (external.address.county) {
        internal.area = external.address.county;
      } else if (external.state_district) {
        internal.area = external.address.state_district;
      }

      if (external.address.city) {
        internal.city = external.address.city;
      }
      else if (external.address.town) {
        internal.city = external.address.town;
      }
      else if (external.address.village) {
        internal.city = external.address.village;
      }
      else if (external.address.hamlet) {
        internal.city = external.address.hamlet;
      }

      if (external.address.city_district) {
        internal.subcity = external.address.city_district;
      }

      if (external.address.suburb) {
        internal.subcity1 = external.address.suburb;
      }

      if (external.address.locality) {
        internal.subcity2 = external.address.locality;
      }

      if (external.address.neighbourhood) {
        internal.neighborhood = external.address.neighbourhood;
      }

      if (external.address.road) {
        internal.streetName = external.address.road;
      }

      if (external.address.house_number) {
        internal.streetNumber = external.address.house_number;
      }

      if (external.address.address29) {
        internal.streetAddress = external.address.address29;
      }

      if (external.address.bus_station) {
        internal.establishment = external.address.bus_station;
      } else if (external.address.bus_stop) {
        internal.establishment = external.address.bus_stop;
      } else if (external.address.marina) {
        internal.establishment = external.address.marina;
      } else if (external.address.ferry_terminal) {
        internal.establishment = external.address.ferry_terminal;
      } else if (external.address.cafe) {
        internal.establishment = external.address.cafe;
      } else if (external.address.restaurant) {
        internal.establishment = external.address.restaurant;
      } else if (external.address.parking) {
        internal.establishment = external.address.parking;
      } else if (external.address.building) {
        internal.establishment = external.address.building;
      } else if (external.address.hairdresser) {
        internal.establishment = external.address.hairdresser;
      } else if (external.address.industrial) {
        internal.establishment = external.address.industrial;
      }
    }

    if (external.lat) {
      internal.latitude = external.lat;
    }
    if (external.lon) {
      internal.longitude = external.lon;
    }

    if (external.boundingbox) {
      var viewport = external.boundingbox;

      if (viewport[0]) {
        internal.viewport.leftTop.latitude = viewport[0];
      }
      if (viewport[1]) {
        internal.viewport.leftTop.longitude = viewport[1];
      }
      if (viewport[2]) {
        internal.viewport.rigthBottom.latitude = viewport[2];
      }
      if (viewport[3]) {
        internal.viewport.rigthBottom.longitude = viewport[3];
      }
    }

  }

  return internal;
}

function create() {
  return _.extend({}, model);
}
