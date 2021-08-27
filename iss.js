const req = require('request');

// const ipifyCall = 'https://api.ipify.org?format=json';
const freeGeoCall = 'https://freegeoip.app/json/';
// const openNotifyCallBroken = 'https://api.open-notify.org/iss-pass.json?';
const openNotifyCall = 'https://iss-pass.herokuapp.com?';

// let myLat = null;
// let myLong = null;

// const fetchMyIP = function(callback) {
// // use request to fetch IP address from ipify API
//   req(ipifyCall, (error, resp, body) => {
//     if (error) return callback(error, null);
    
//     if (resp.statusCode !== 200) { // if not successful, what was the error?
//       callback(error(`Status Code ${resp.statusCode} when fetching IP: ${body}`), null);
//       return;
//     }

//     const myIP = JSON.parse(body).ip; // parsing string to JSON
//     // const ip = JSON.parse(body).ip;
//     callback(null, myIP); // call back takes in error and ip

//   });
// };


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
    const coords = { latitide: myLat, longitude: myLong };
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
  const url = `${openNotifyCall}lat=${coords.latitude}&lon=${coords.longitude}`;

  req(url, (error, response, body) => {
    // console.log(`${openNotifyCall}lat=${myLat}&lon=${myLong}`); // returns null
    //console.log(`${openNotifyCall}lat=${myCoords.latitide}&lon=${myCoords.longitude}`); // return undefined
    if (error) {
      callback(error, null);
      return;
    }
    
    // console.log('coords value from fetchISSFlyBy definition', coords);
    // console.log("latitude was ", myLat);
    // console.log("longitude was ", myLong);

    if (response.statusCode !== 200) {
      callback(Error(`Oops, can't get flyby's: ${body}`), null); // passing error and null
      return;
    }

    // let flybysRiseArr = JSON.parse(body).response.risetime;
    // let flybysDurArr = JSON.parse(body).response.duration;

    //console.log('Rise Array: ', flybysRiseArr);

    const passes = JSON.parse(body).response;
    // console.log('results = ', results)
    callback(null, passes);
  });
};

module.exports = {
  // fetchMyIP,
  fetchISSFlyOverTimes,
  fetchCoordsByIP
};