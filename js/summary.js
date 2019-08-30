const cancelUrl = "http://localhost:3000/html/cancel.html";

function chargeRequest() {
  var ajax = $.ajax({
    type: "POST",
    contentType: 'application/json; charset=utf-8',
    dataType: "json",
    url: "http://localhost:3000/chargerequest"
  }).then(function(data) {
    //I need to insert an IF here to test if the redirect URL exists
    //or if it was an error.
    console.log(data);
    window.location.replace(data.redirect.url);
    return data;
  });
  return ajax;
}

function loadRequestedList() {
  var ajax = $.ajax({
    type: "POST",
    url: "http://localhost:3000/loadrequestedlist"
  }).then(function(requestedList) {
    console.log(requestedList);
    return requestedList;
  });
  return ajax;
}

function loadListLongId() {
  var ajax = $.ajax({
    type: "POST",
    url: "http://localhost:3000/loadListLongId"
  }).then(function(responseListLongId) {
    console.log(responseListLongId);
    return responseListLongId;
  });
  return ajax;
}

//
function evaluateChargeResponse(chargeResponse) {
  if (chargeResponse.returnCode.name == "OK") {
    window.location.replace(chargeResponse.redirect.url);
  }
}

$(document).ready(function() {
  loadRequestedList().then(function(requestedList) {
    $("#total").append(requestedList.payment.amount);
  });
  //loadListLongId();
  $("#confirmBtn").click(function() {
    chargeRequest();
  });
  $("#cancelBtn").click(function() {
    window.location.replace(cancelUrl);
  });
});
