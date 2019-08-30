var escapeHtml = require("escape-html");
var responseData = "";
var inputData = {
  transactionId: "",
  cartAmount: 0,
  integrationScenario: "PURE_NATIVE"
};

//Helper functions

function generateTransactionID() {
  min = 0;
  max = 100000;
  //The maximum is exclusive and the minimum is inclusive
  inputData.transactionId = "id" + Math.floor(Math.random() * (max - min)) + min;
  console.log("Transaction ID: ", inputData.transactionId);
}

function readCartAmount(cartInputId, keyId, callback) {
//reads cart amount from cartInputId via keyboard input indicated by keyId.
//keyId = 13 for "Enter" key.
  $(cartInputId).keypress(function(keyboardInput) {
    let key = keyboardInput.which;
    if (key == keyId) {
      //Reads shopping cart value
      inputData.cartAmount = $(cartInputId).val();
      console.log("Cart amount: ", inputData.cartAmount);
    }
  });
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
    newList.payment.amount = inputData.cartAmount;
    newList.products[0].amount = inputData.cartAmount;
    console.log("Test LIST Request: ", newList);
    return newList;
  } else {
    return Error("Problem loading list");
  }
}

function listRequest(list) {
  /* Makes a list request to the server */
  var listJSON = JSON.stringify(list);
  var ajax = $.ajax({
    type: "POST",
    contentType: 'application/json; charset=utf-8',
    data: listJSON,
    dataType: "json",
    url: "http://localhost:3000/listrequest"
  }).then(function(data) {
    console.log("Test LIST Response: ", data);
    return data;
  });
  return ajax;
}

function listResponse(response) {
  //Need to make this deferred
  store.listRequest = response;
}

//////////////////////////////////// KF ////////////////////////////////////////

const jQ = () => window.jQuery || window

const store = {
  listRequest: null
}

// store.optilePaymentListId = 'PUT_YOUR_LIST_ID_HERE'

function domReady (node) {
  store.node = node
}

function buildDomTree (
  container,
  stepContainer,
  paymentNetworks,
  payButtonContainer,
  payButton
) {
  //const $ = jQ()
  // this time, paymentNetworks and payButtonContainer are siblings
  const domTree = "<div id='" + stepContainer + "'><div id='" + paymentNetworks + "'></div><div id='" + payButtonContainer + "'><button id='" + payButton + "'></button></div></div>";

  $(domTree).appendTo($("#" + container));

  return domTree
}

function destroy (id) {
  //const $ = jQ()
  //$(`#${id}`).remove()
  $("#" + id).remove();
}

function destroyFirstStep() {
  if (store.destroyFirstStep) {
    store.destroyFirstStep()
  }
}

function destroySecondStep() {
  if (store.destroySecondStep) {
    store.destroySecondStep()
  }
}

function initFirstStep(response, reInit) {
  const mainContainer = 'paymentNetworksContainer'
  const firstStepContainer = 'firstStepContainer'
  const paymentNetworks = 'paymentNetworksFirstStep'
  const payButtonContainer = 'payButtonContainerFirstStep'
  const payButton = 'payButtonFirstStep'
  const domTree = buildDomTree(mainContainer, firstStepContainer, paymentNetworks, payButtonContainer, payButton)


  //const $ = jQ()
  //$(store.node).append(domTree)

  store.destroyFirstStep = () => {
    destroy(firstStepContainer)
    store.destroyFirstStep = null
  }

  //domTree.find(`#${paymentNetworks}`).checkoutList({
    $("#paymentNetworksFirstStep").checkoutList({
    payButtonContainer,
    payButton,
    baseUrl: "https://api.sandbox.oscato.com/pci/v1/",
    listId: response.identification.longId,
    proceedFunction: () => {
      console.log('proceedFunction called')
    }
  }, reInit || false)
}

function initSecondStep(reInit) {
  const mainContainer = 'paymentNetworksContainer'
  const secondStepContainer = 'secondStepContainer'
  const paymentNetworks = 'paymentNetworksSecondStep'
  const payButtonContainer = 'payButtonContainerSecondStep'
  const payButton = 'payButtonSecondStep'
  const domTree = buildDomTree(mainContainer, secondStepContainer, paymentNetworks, payButtonContainer, payButton)

  //const $ = jQ()
  //$(store.node).append(domTree)

  store.destroySecondStep = () => {
    destroy(secondStepContainer)
    store.destroySecondStep = null
  }

  //domTree.find(`#${paymentNetworks}`).checkoutList({
    $("#paymentNetworksSecondStep").checkoutList({
    payButtonContainer,
    payButton,
    baseUrl: "https://api.sandbox.oscato.com/pci/v1/",
    listId: store.listRequest.identification.longId,
    summaryPage: true,
    summaryPageHandler: {
      doOperation () {
        console.log('doOperation called')
      },
      onResult () {
        console.log('onResult called')
      }
    }
  }, reInit || true)
}

//////////////////////////// Core Stuff ////////////////////////////////////////

$(document).ready(function() {
  generateTransactionID();
  readCartAmount("#cartAmount", 13);

  $("#listBtn").click(function() {
    loadList()
      .then(function(loadedList) {
        return modifyList(loadedList);
      })
      .then(function(list) {
        return listRequest(list);
      })
      .then(function(response) {
        listResponse(response);
        initFirstStep(response, false);
      });
  });

  $("#newSession").click(function() {
    generateTransactionID();
  });

  $("#destroyFirstStep").click(function() {
    destroyFirstStep();
    console.log("Destroy 1st step");
  });

  $("#initSecondStep").click(function() {
    initSecondStep(true);
    console.log("Init 2nd step");
  });

  $("#destroySecondStep").click(function() {
    destroySecondStep();
    console.log("Destroy 2nd step");
  });

  $("#initFirstStep").click(function() {
    initFirstStep(store.listRequest, true);
    console.log("Init 1st step");
  });

});
