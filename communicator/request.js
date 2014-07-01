/**
 * [Doc Google API](http://wiki.openstreetmap.org/wiki/Nominatim)
 */

var request = require("request");
var util = require("util");
var _ = require('underscore');

var CommunicationError = require('./error');
var config = require('./config.json');

/**
 * Constructor
 */
function Searcher() {
  this._initDefaultOptions();
}

/**
 * @access public
 */
Searcher.prototype.geocode = function (address, callback, options) {
  address = (address).toString();
  if (!address.length) {
    return callback(
      new CommunicationError("Address parameter is mandatory.")
    );
  }
  
  this._useExternalMethod('search');

  options = _.extend(
    { q: address},
    (options || {})
  );
  this._useOptions(options);
  
  this._send(callback);
};

/**
 * @access public
 */
Searcher.prototype.reverseGeocode = function (lat, lng, callback, options) {
  lat = parseFloat(lat);
  lng = parseFloat(lng);
  
  if (!lat || !lng) {
    return callback(
      new CommunicationError("Geographical coordinates are mandatory.")
    );
  }

  this._useExternalMethod('reverse');

  options = _.extend(
    { lat: lat, lon: lng },
    (options || {})
  );
  this._useOptions(options);

  this._send(callback);
};

/**
 * @access protected
 */
Searcher.prototype._send = function (callback) {
  try {
    request({
      uri: this._getUri() + this._getMethod(),
      qs: this._getOptions()
    }, function (error, response, body) {
      if (error) {
        return callback(error);
      } else {
        callback(null, JSON.parse(body));
      }
    });
  } catch (error) {
    return callback(error);
  }
}

/**
 * @access protected
 */
Searcher.prototype._getUri = function () {
  if (!this._checkUri()) {
    this._initUri();
  }

  this._checkUriWithError();
  
  return this.uri;
}

/**
 * @access protected
 */
Searcher.prototype._initUri = function () {
  this.uri = config['uri'];
}

/**
 * @access protected
 */
Searcher.prototype._checkUri = function () {
  return (this.uri && this.uri.length);
}

/**
 * @access protected
 */
Searcher.prototype._checkUriWithError = function () {
  if (!this._checkUri()) {
    throw new CommunicationError("Uri is not valid.")
  }
  return true;
}

/**
 * @access protected
 */
Searcher.prototype._useExternalMethod = function (methodName) {
  methodName = (methodName).toString();
  method = config[methodName];
  
  if (!method) {
    throw new CommunicationError(util.format(
      'Method mapping %sis incorrect.',
      (methodName) ? util.format('for internal method \'%s\' ', methodName) : ''
    ));
  }

  this.method = method;
}

/**
 * @access protected
 */
Searcher.prototype._getMethod = function () {
  this._checkMethodWithError();
  return this.method;
}

/**
 * @access protected
 */
Searcher.prototype._checkMethod = function () {
  return (this.method && this.method.length);
}

/**
 * @access protected
 */
Searcher.prototype._checkMethodWithError = function () {
  if (!this._checkMethod()) {
    throw new CommunicationError("Method is not valid.")
  }
  return true;
}

/**
 * @access protected
 */
Searcher.prototype._useOptions = function (options) {
  this.options = _.extend({}, this.defaultOptions);
  _.extend(this.options, (options || {}));
}

/**
 * @access protected
 */
Searcher.prototype._initDefaultOptions = function () {
  this.defaultOptions = _.extend(
    {},
    config['options'] || {}
  );
}

/**
 * @access protected
 */
Searcher.prototype._getOptions = function () {
  return this.options;
}

module.exports = new Searcher();
