var responseData = "";
var inputData = {
  transactionId: "",
  donation: 0,
  integrationScenario: "SELECTIVE_NATIVE"
};

function generateTransactionID() {
  min = 0;
  max = 100000;
  //The maximum is exclusive and the minimum is inclusive
  inputData.transactionId = "id" + Math.floor(Math.random() * (max - min)) + min;
  console.log(inputData.transactionId);
}

function readDonation() {
  //inputData.donation = document.getElementById("donationValue").value;
  inputData.donation = $("#donationValue").val();
  console.log(inputData.donation);
}

function readIntegrationScenario() {
  inputData.integrationScenario = $("#integrationScenario").val();
  console.log(inputData.integrationScenario);
}

function loadList() {
  /* Makes a call to load the standard list.json file
  from the server */
  var ajax = $.ajax({
    type: "POST",
    url: "http://localhost:3000/loadlist",
  }).then(function(data) {
    return data;
  });
  return ajax;
}

function modifyList(list) {
  /* Modifies the list based on user Input Data */
  if (list) {
    var newList = list;
    newList.transactionId = inputData.transactionId;
    newList.payment.amount = inputData.donation;
    console.log(newList);
    return newList;
  } else {
    return Error("Problem loading list");
  }
}

function listRequest(list) {
  /* Makes a list request to the server */
  var listJSON = JSON.stringify(list);
  console.log(listJSON);
  var ajax = $.ajax({
    type: "POST",
    contentType: 'application/json; charset=utf-8',
    data: listJSON,
    dataType: "json",
    url: "http://localhost:3000/listrequest"
  }).then(function(data) {
    console.log(data);
    return data;
  });
  return ajax;
}

function loadIFrameHosted(data) {
  responseData = data;
  iframe = document.createElement("iframe");
  iframe.width = "800px";
  iframe.height = "400px";
  iframe.src = responseData.redirect.url;
  console.log(responseData);
  console.log(responseData.redirect.url);
  $("#paymentNetworks").append(iframe);
  $("#listBtn").hide();
  $("#donationValue").attr("disabled", true);
  $("#donationBtn").attr("disabled", true);
}

function loadIFrameSelectiveNative(data) {
  responseData = data;
  $("#paymentNetworks").checkoutList({
    payButton: "submitBtn",
    baseUrl: "https://api.sandbox.oscato.com/pci/v1/",
    listUrl: responseData.links.self,
    smartSwitch: false,
    developmentMode: false
  });
  $("#submitBtn").show();
  $("#listBtn").hide();
  $("#donationValue").attr("disabled", true);
  $("#donationBtn").attr("disabled", true);
}

$(document).ready(function() {
  generateTransactionID();
  $("#donationBtn").click(function() {
    readDonation();
  });
  $("#listBtn").click(function() {
    loadList()
      .then(function(loadedList) {
        return modifyList(loadedList);
      })
      .then(function(list) {
        return listRequest(list);
      })
      .then(function(listResponse) {
        loadIFrameHosted(listResponse);
      });
  });
});
