var responseData = "";
var inputData = {
  transactionId: "",
  cartAmount: 0,
  integrationScenario: "SELECTIVE_NATIVE" //currently not used
};

var randomID = (min, max) => "id" + Math.floor(Math.random() * (max - min)) + min

function generateTransactionID() {
  min = 0;
  max = 100000;
  //The maximum is exclusive and the minimum is inclusive
  inputData.transactionId = randomID(min, max);
  console.log("Transaction ID: ", inputData.transactionId);
}

var readCartAmount = (cartInputId, keyId) => {
  //reads cart amount from cartInputId via keyboard input indicated by keyId.
  //keyId = 13 for "Enter" key.
  $(cartInputId).keypress((keyboardInput) => {
      let key = keyboardInput.which;
      if (key == keyId) {
        //Reads shopping cart value
        inputData.cartAmount = $(cartInputId).val();
        console.log("Cart amount: ", inputData.cartAmount);
      }
    });

}

function readIntegrationScenario() {
  /*Not used for now, the idea is to make a selectable integration scenario from
  the top menu */
}

function loadJSONInspector(JSONInspectorId, json) {
  $(JSONInspectorId).html("<pre><code class='json'>" + json + "</code></pre>");
  console.log(json);
}

export {
  generateTransactionID,
  readCartAmount,
  loadJSONInspector
};
