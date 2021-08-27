const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');
let ourIP = '';
let exampleCoords = { latitude: '49.2246', longitude: '-123.0711'}; 

fetchCoordsByIP(ourIP, (error, coords) => { // callback
  if (error) {
    console.log("Something went wrong: ", error);
    return;
  }

  console.log("Success, these are your coordinates: ", coords);
  
});

// call imported function - pass our coordinates to this function call
fetchISSFlyOverTimes(exampleCoords, (error, passTimes) => {
  // cant pass coordinates from other function? have to hard code them?

  // console.log('ourCoords value in fetchISSFlyOverTimes function call', ourCoords);

  if (error) {
    console.log("something didnt go quite right, ", error);
    return;
  }

  console.log('SUCCESS, see your flyby times: ' + passTimes);

});


module.exports = { fetchMyIP, fetchCoordsByIP };