const fs = require('fs');
const http = require('http');
const request = require('request-promise');
const jsonList = require('../json/list.json');
const credentials = require('../json/credentials.json');
const optileHeaders = {
  "Accept": "application/vnd.optile.payment.enterprise-v1-extensible+json",
  "Content-Type": "application/vnd.optile.payment.enterprise-v1-extensible+json",
  "Authorization": ""
};
const nightlyUrl = "https://api.live.nightly.oscato.net/api/lists/";
const integrationUrl = "https://api.integration.oscato.com/api/lists/";
const sandboxUrl = "https://api.sandbox.oscato.com/api/lists?view=routes";
const liveUrl = "https://api.live.oscato.com/api/lists/";
var baseUrl = sandboxUrl; //change baseUrl here when testing
var requestedList = {};
var responseListLongId = "";

//Exposed functions
module.exports = {
  //loads list to be modified in the browser
  loadList: function() {
    return new Promise(function(resolve, reject) {
      if (jsonList) {
        resolve(jsonList);
      } else {
        reject(Error('Problem loading List from Server'));
      }
    });
  },
  //performs a LIST request
  listRequest: function(input) {
    requestedList = input;
    optileHeaders.Authorization = 'Basic ' + Buffer.from(credentials.basic.merchant_code + ":" + credentials.basic.token).toString('base64');
    //tried btoa() but it would not work with node.js.
    return request({
        url: baseUrl,
        method: "POST",
        headers: optileHeaders,
        json: true,
        body: requestedList
      })
      .then(function(response) {
        responseListLongId = response.identification.longId;
        return response;
      })
      .catch(console.log.bind(console));
  },
  //performs a CHARGE request, used now after a PRESET
  chargeRequest: function() {
    return request({
        url: baseUrl + responseListLongId + "/charge",
        method: "POST",
        headers: optileHeaders,
        json: true,
        body: {} //by documentation, the body can be an empty object when using PRESET
      })
      .then(function(response) {
        console.log(response);
        return response;
      })
      .catch(console.log.bind(console));
  },
  //loads the LIST requested by listRequest()
  loadRequestedList: function() {
    return new Promise(function(resolve, reject) {
      if (requestedList != {}) {
        resolve(requestedList);
      }
      reject(Error('Requested list is empty'));
    });
  },
  //loads LIST response longId
  loadListLongId: function() {
    return new Promise(function(resolve, reject) {
      if (responseListLongId != {}) {
        resolve(responseListLongId);
      }
      reject(Error('List response ID not found'));
    });
  }

  //other functions, preset, charge, close, etc.
}
