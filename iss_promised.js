const request = require('request-promise-native');

const fetchMyIP = function () {
  return request('https://api64.ipify.org?format=json/');
};

const fetchCoordsByIP = function(body) {
  // console.log(ip);
  // console.log("iss consoole: ", body); // returning ip
  // console.log("ISS console:", body);
  // const ip = JSON.parse(body).ip;
  return request(`https://freegeoip.app/json/${body}`);
}

const fetchISSFlyOverTimes = function(body) {
  // console.log('body',body);
  const { latitude, longitude } = JSON.parse(body);
  const url = `https://iss-pass.herokuapp.com?lat=${latitude}&lon=${longitude}`;
  // console.log('latitude', latitude);
  return request(url)
  // https://iss-pass.herokuapp.com?lat=${latitude}&lon=${longitude}
}

const nextISSTimesForMyLocation = function(){
  return fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then((data) => {
  // console.log('data', data);
    const { response } = JSON.parse(data);
    // console.log('response ', response);
    return response;
  });

};

module.exports = { nextISSTimesForMyLocation };