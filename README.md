##search-osm-geocoder

### General
Node.js module for geocoding and reverse geocoding.  
[**Uses service Open Street map geocoding API (Nominatim tool)**](http://wiki.openstreetmap.org/wiki/Nominatim).

Geocoding is the process of matching address with geographic coordinates.  
Reverse Geocoding is the process of matching geographic coordinates with address.

[*Address geocoding*](http://wiki.openstreetmap.org/wiki/Nominatim#Search).  
Provide an address or location and receive potential OSM geocodes.  
[*Reverse geocoding*](http://wiki.openstreetmap.org/wiki/Nominatim#ReverseSearch).  
Provide latitude and longitude coordinates and receive the known address information for that location.

[Usage Limits](http://wiki.openstreetmap.org/wiki/Nominatim_usage_policy).

### Installation
>npm install search-osm-geocode [-S]

### Usage example
```javascript
// initialize geocoder instance
var geocoder = require('search-osm-geocode');

// request parameters
const ADDRESS = 'Kyiv, Khreshchatyk';
const LATITUDE = '50.45';
const LONGITUDE = '30.523';
const LANGUAGE = 'en';

// you can use Open Street Map options to manage result format
var options = {
  'accept-language': LANGUAGE
};

// use callback to return result from geocoding process
function callback (error, result) {
  if (error) console.log(error); // on error
  else console.log(result); // on success
}

// address geocoding
geocoder.geocode(ADDRESS, callback, options);
// reverse geocoding
geocoder.reverseGeocode(LATITUDE, LONGITUDE, callback, options);
```
