var _ = require('underscore');

var Searcher = require('./communicator/request');
var Parser = require('./communicator/parser');

/**
 * Wrapper - call Google geocoder and parse result
 */
function CommunicationWrapper() {}

CommunicationWrapper.prototype.extendCallback = function (callback) {
  return function (error, data) { 
    (error)
      ? Parser.emit('parse_error', error)
      : Parser.emit('parse_data', data);

    if (_.isFunction(callback)) {
      callback(error, data);
    }
  }
}

/**
 * @access public
 */
CommunicationWrapper.prototype.geocode = function (address, callback, options) {
  var extendedCallback = this.extendCallback(callback);
  Searcher.geocode(address, extendedCallback, options);
}

/**
 * @access public
 */
CommunicationWrapper.prototype.reverseGeocode = function (lat, lng, callback, options) {
  var extendedCallback = this.extendCallback(callback);
  Searcher.reverseGeocode(lat, lng, extendedCallback, options);
}

module.exports = new CommunicationWrapper();
