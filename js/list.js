//List request / response handler
//Sandbox: Basic REVNT19IT01FUk86ZnEzcmpmZmdwYjNjcXZhYW5qODdsbmZ1cGRsYjVhbmtxNGlqOHV0a3Bw
// Sandbox Simon Spielplatz: Basic U0lNT05QTEFZR1JPVU5EOmdwdGR0MHN1bWhsNjVwZDBmYmJwc2NlZ2d2MmFoZWVoNnA5bDc3MG8=
//Nightly: Basic REVNT19IT01FUk86bGtjMzFoNXJuZ3Zrc2g4cmdrOHB1dnNpNmx1bmdscDNxZXE2ajQ2MQ==
//Integration - Joseph: Basic TEFMQTprMTdxMG5rbDloZTlpZ29kMzdlMzRxOGttbWhhNG9wdWgydm0zNWl0
//Integration demoHomero: Basic REVNT19IT01FUk86M21hbzQ0c2dxYjhsNDRybmRqZmR0YjV0MGpqbGtoMDFiMWo5b2F2NQ==
//Live demoHomero: Basic REVNT19IT01FUk86dTh2MG1hN2cxdDhmcDgydTdjZGYyNjdndWlxamNtbWltN283N2FvMw==
//KF: Basic S0lOR0ZJU0hFUjo5b2M5YmQ0NGtlZXQ3Z2YzdDlxNDZjNmZhcTAyczgybGtoY3Zua2to
// CAFR: Basic Q0FGUjoxMWlvcDdiNGlucTA4cHNjcGUzNHU3bnZhOXZscWtrdGVrbXM0anBm
const fs = require('fs');
const http = require('http');
const request = require('request-promise');
const jsonList = require('../json/list.json');
const optileHeaders = {
  "Accept": "application/vnd.optile.payment.enterprise-v1-extensible+json",
  "Content-Type": "application/vnd.optile.payment.enterprise-v1-extensible+json",
  "Authorization": "Basic REVNT19IT01FUk86ZnEzcmpmZmdwYjNjcXZhYW5qODdsbmZ1cGRsYjVhbmtxNGlqOHV0a3Bw"
};
const nightlyUrl = "https://api.live.nightly.oscato.net/api/lists/";
const integrationUrl = "https://api.integration.oscato.com/api/lists/";
const sandboxUrl = "https://api.sandbox.oscato.com/api/lists/";
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
