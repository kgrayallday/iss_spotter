const req = require('request');

const ipifyCall = 'https://api.ipify.org?format=json';
const freeGeoCall = 'https://freegeoip.app/json/';
// const openNotifyCallBroken = 'https://api.open-notify.org/iss-pass.json?';
const openNotifyCall = 'https://iss-pass.herokuapp.com?';

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) { // returns error and ip
  // use request to fetch IP address from ipify API
  req(ipifyCall, (error, resp, body) => {
    if (error) return callback(error, null);
    
    if (resp.statusCode !== 200) { // if not successful, what was the error?
      callback(error(`Status Code ${resp.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    const myIP = JSON.parse(body).ip; // parsing string to JSON
    // console.log("IP is >>> ", myIP);
    callback(null, myIP); // call back takes in error and ip

  });
};


/**
 * Makes a single API request to retrieve the lat/lng for a given IPv4 address.
 * Input:
 *   - The ip (ipv4) address (string)
 *   - A callback (to pass back an error or the lat/lng object)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The lat and lng as an object (null if error). Example:
 *     { latitude: '49.27670', longitude: '-123.13000' }
 */
const fetchCoordsByIP = function(myIP, callback) {
  // use request to fetch coordinates from FreeGeo API
  req(`${freeGeoCall}${myIP}`, (error, resp, body) => {
    
    // FreeGeo doesnt need you to pass your IP it runs it for you
    if (error) return callback(error, null);

    if (resp.statusCode !== 200) {
      callback(Error(`Something went wrong when fetching Geo Coordinates: ${body}`), null); // passing error and null
      return;
    }

    const myLong = JSON.parse(body).longitude;
    const myLat = JSON.parse(body).latitude;
    const coords = { latitude: myLat, longitude: myLong };
    // console.log("coordinates are >>> ", coords);
    callback(null, coords); // passes back null error and coordinates
  });
};


/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  // console.log("coords of fetchISSFlyOverTimes", coords);
  const url = `${openNotifyCall}lat=${coords.latitude}&lon=${coords.longitude}`;

  req(url, (error, response, body) => {
    // console.log(`${openNotifyCall}lat=${myLat}&lon=${myLong}`); // returns null
    //console.log(`${openNotifyCall}lat=${myCoords.latitide}&lon=${myCoords.longitude}`); // return undefined
    if (error) {
      callback(error, null);
      return;
    }
    
    if (response.statusCode !== 200) {
      callback(Error(`Oops, can't get flyby's: ${body}`), null); // passing error and null
      return;
    }

    const passes = JSON.parse(body).response;
    // console.log('passes = ', passes)
    callback(null, passes);
  });

};







/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
 const nextISSTimesForMyLocation = function(callback) {
  // empty for now

  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }
    
      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};





module.exports = {
  // fetchMyIP,
  fetchISSFlyOverTimes,
  fetchCoordsByIP, 
  nextISSTimesForMyLocation
};