(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*!
 * escape-html
 * Copyright(c) 2012-2013 TJ Holowaychuk
 * Copyright(c) 2015 Andreas Lubbe
 * Copyright(c) 2015 Tiancheng "Timothy" Gu
 * MIT Licensed
 */

'use strict';

/**
 * Module variables.
 * @private
 */

var matchHtmlRegExp = /["'&<>]/;

/**
 * Module exports.
 * @public
 */

module.exports = escapeHtml;

/**
 * Escape special characters in the given string of html.
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 * @public
 */

function escapeHtml(string) {
  var str = '' + string;
  var match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  var escape;
  var html = '';
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#39;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index
    ? html + str.substring(lastIndex, index)
    : html;
}

},{}],2:[function(require,module,exports){
var escapeHtml = require("escape-html");
var responseData = "";
var inputData = {
  transactionId: "",
  cartAmount: 0,
  integrationScenario: "PURE_NATIVE"
};

//Helper functions

/*
function generateTransactionID() {
  min = 0;
  max = 100000;
  //The maximum is exclusive and the minimum is inclusive
  inputData.transactionId = "id" + Math.floor(Math.random() * (max - min)) + min;
  console.log("Transaction ID: ", inputData.transactionId);
}
*/

var randomID = () => "id" + Math.floor(Math.random() * (max - min)) + min

var generateTransactionID = (trID) => {
  trID = randomID;
  console.log("Transaction ID: ", trID);
}

/*
function readCartAmount() {
  //Reads shopping cart value
  inputData.cartAmount = $("#cartAmount").val();
  console.log("Cart amount: ", inputData.cartAmount);
}
*/

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

function readIntegrationScenario() {
  /*Not used for now, the idea is to make a selectable integration scenario from
  the top menu */
}

function loadJSONInspector(JSONInspectorId, json) {
  $(JSONInspectorId).html("<pre><code class='json'>" + json + "</code></pre>");
  console.log(json);
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
    console.log("LIST Request: ", newList);
    loadJSONInspector("#JSONInspector", JSON.stringify(newList));
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
    console.log("LIST Response: ", data);
    return data;
  });
  return ajax;
}

function opTemplateEngine(template, placeholders, defaultValue, isEscapeHtml) {
  if (template) {
    // if not defined - empty map
    placeholders = placeholders || {};
    defaultValue = (defaultValue) ? escapeHtml(defaultValue) : "";

    // HTML templates from OPP support a placeholder pattern: ${ placeholder_name }
    return template.replace(/\${(.*?)}/g, function(match, text) {
      var value = placeholders[text];
      return (value) ?
        ((isEscapeHtml) ? escapeHtml(value) : value) :
        defaultValue;
    });
  } else {
    return template;
  }
}

function drawNetworkForms(applicableNetworks) {
  $.each(applicableNetworks, function(index) {
    let network = applicableNetworks[index];

    $("#paymentNetworks").append(function() {
      return "<div class='available-network' id = '" + network.code + "'>" +
        "<input type = 'radio' name = '" + network.code + "' id = 'radio" + network.code + "'>" +
        "<img src = '" + network.links.logo + "'" + "height = '40px'" + "/>" +
        "<div id = 'formContainer" + network.code + "' " +
        "class = 'formContainer formContainer" + network.code + "'" +
        "style = 'display:block;'" + ">" +
        "</div>" +
        "</div>"
    });
  });
}

function showGlobalErrorMessage(text) {
  var listContainer = $('#paymentNetworks');
  if (listContainer.has(".ERROR").length === 0) {
    listContainer.prepend($("<div class='ERROR'></div>"));
  }
  listContainer.find(".ERROR").html(text);
}

function showGlobalSuccessMessage(text) {
  var listContainer = $('#paymentNetworks');
  if (listContainer.has(".MESSAGE").length === 0) {
    listContainer.prepend($("<div class='MESSAGE'></div>"));
  }
  listContainer.find(".MESSAGE").html(text);
}

function summaryPageHandlerOnResult(data) {
  console.log("Result Data: ", data);
  switch (data.interaction.code) {
    case "PROCEED":
      $("#paymentNetworks").empty();
      $("#submitBtnContainer").hide();
      showGlobalSuccessMessage("Payment is done!")
      break;

    case "ABORT":
      $("#paymentNetworks").empty();
      $("#submitBtnContainer").hide();
      if (data.error instanceof Error) {
          showGlobalErrorMessage("Payment is aborted by Client!")
      } else {
          showGlobalErrorMessage("Payment is aborted!");
      }
      break;

    case "TRY_OTHER_ACCOUNT":
    case "RETRY":
      showGlobalErrorMessage("interaction." + data.interaction.code + "." + data.interaction.reason);
      break;
    case "TRY_OTHER_NETWORK":
    case "RELOAD":
      $("#paymentNetworks").empty();
      $("#submitBtnContainer").html('<button id="submitBtn" type="button"></button>');
      //loadSummaryPage(data);
      window.setTimeout(function() {
        showGlobalErrorMessage("interaction." + data.interaction.code + "." + data.interaction.reason);
      }, 2000);
      break;
  }
}

function resultCallback(result) {
  console.log("Result: ", result);
  window.location.replace(result.redirect.url);
}

function loadIFrameHosted(data) {
  var responseData = data;
  var deferred = $.Deferred();
  var iframe = $("<iframe class='hiddenFrame'></iframe>").attr({
    "id": "payment-widget",
    "src": responseData.redirect.url,
    "width": "100%",
    "height": "341px"
  });
  iframe.load(deferred.resolve);
  console.log("first");
  deferred.done(function() {
    console.log("second");
  });
  //iframe = document.createElement("iframe");
  //iframe.id = "payment-widget";
  //iframe.width = "100%";
  //iframe.height = $(window).height() + "px";
  //iframe.height = iframe.contentWindow.document.body.offsetHeight;
  //iframe.src = responseData.redirect.url;
  console.log(responseData);
  console.log(responseData.redirect.url);
  $("#paymentNetworks").append(iframe);
  $("#submitBtn").hide();
  $("#cartAmount").attr("disabled", true);
  $("#listBtn").attr("disabled", true);

  return deferred.promise();
}

function loadIFrameSelectiveNative(data) {
  let responseData = data;
  $("#paymentNetworks").checkoutList({
    payButton: "submitBtn",
    payButtonContainer: "submitBtnContainer",
    baseUrl: "https://api.sandbox.oscato.com/pci/v1/",
    listUrl: responseData.links.self,
    smartSwitch: true,
    liveValidation: true,
    developmentMode: true,
	/*
    abortFunction: function(responseData) {
      console.log("Abort: ", responseData)
    },
	*/

    proceedFunction: function(proceedResponse) {
      $("#paymentNetworks").empty();
      loadSummaryPage(responseData, proceedResponse);
    }

  }, false);
  $("#submitBtn").show();
  $("#cartAmount").attr("disabled", true);
  $("#listBtn").attr("disabled", true);
}

function loadPureNative(data) {
  let responseData = data;
  let applicableNetworks = responseData.networks.applicable;
  let localizedFormName = "optileHTMLSnippet";
  let opg_origin = "https://resources.sandbox.oscato.com/";

  //Hide input fields and buttons
  $("#listBtn").hide();
  $("#listBtn").attr("disabled", true);
  $("#cartAmount").attr("disabled", true);

  drawNetworkForms(applicableNetworks);

  $.each(applicableNetworks, function(index) {
    let network = applicableNetworks[index];

    $("#radio" + network.code).click(function() {
      $("#submitBtnContainer").empty();

      if ("iFrame" in network.links) {
        $("#submitBtnContainer").append(function() {
          return "<button id = 'submitBtn' type = 'button'>Pay</button>" +
            "<span id = 'paymentLoadingIcon' class = 'payment-in-progress' style = 'display: none;'></span>"
        });

        $("#formContainer" + network.code).append(function() {
          return "<div class = '" + localizedFormName + "'" +
            "id = 'snippet" + network.code + "'" +
            "data-code = '" + network.code + "'" + "'>" +
            "<iframe " +
            "id = 'iFrame" + network.code + "'" +
            "src = '" + network.links.iFrame + "'" +
            "width = '100%'" +
            "height = '" + network.links.iFrameHeight + "px'" +
            "style = 'border:none;'" + ">" +
            "</iframe>" +
            "</div>"
        });

      } else {
        $("#submitBtnContainer").append(function() {
          return "<span id = 'paymentLoadingIcon' class = 'payment-in-progress' style = 'display: none;'></span>"
        });

        $("#formContainer" + network.code).append(function() {
          return "<div class = '" + localizedFormName + "'" +
            "id = 'snippet" + network.code + "'" +
            "data-code = '" + network.code + "'" +
            "data-src = '" + network.links.localizedForm + "'>" +
            "</div>"
        });

        let src = network.links.localizedForm;
        let code = network.code;
        //Load the form snippet into the div with the placeholders replaced
        $.ajax({
          type: "GET",
          url: src,
          context: this
        }).then(function(response) {
          let htmlSnippet = opTemplateEngine(response, {
            formId: code
          });
          var submitButtonDiv = document.getElementById("submitBtnContainer");
          // Set the current elements html to the html where placeholders have been replaced
          $("." + localizedFormName).html(htmlSnippet);

          if (this.name == "PAYPAL" && typeof window["fnPAYPAL_initSubmit"] === "function") {
            console.log("Exists, this name: ", this.name);
            console.log("Network object: ", applicableNetworks[index]);
            fnPAYPAL_initSubmit(applicableNetworks[index], submitButtonDiv, resultCallback);
          } else {
            console.log("Does not exist");
          }

        });
      }
    });

  });

}

function loadSummaryPage(inputData, proceedData) {
  console.log("Proceed Data: ", proceedData);
  console.log("Input Data", inputData);
  $("#paymentNetworks").html("Summary:");
  $("#paymentNetworks").checkoutList({
    payButton: "submitBtn",
    payButtonContainer: "submitBtnContainer",
    listUrl: inputData.links.self,
    summaryPage: true,
    summaryPageHandler: {
      doOperation: function(data, callBack) {
        $.ajax({
          type: data.method,
          dataType: "json",
          data: JSON.stringify(data.operationData ? data.operationData : {}),
          contentType: "application/json",
          url: data.url
        }).done(callBack)
      },
      onResult: summaryPageHandlerOnResult,
      proceedFunction: null
    }
  }, true);
}

function loadSummaryPageGoogle(inputData, proceedData) {
  console.log("Proceed Data: ", proceedData);
  console.log("Input Data", inputData);
  $("#paymentNetworks").html("Summary:");
  $("#paymentNetworks").checkoutList({
    payButton: "submitBtn",
    payButtonContainer: "submitBtnContainer",
    listUrl: inputData.links.self,
    summaryPage: true,
    summaryPageHandler: {
      doOperation: function(doOperationData) {
        var result = null;
        $.ajax({
          type: doOperationData.method,
          dataType: "json",
          data: JSON.stringify(doOperationData.operationData ? doOperationData.operationData : {}),
          contentType: "application/json",
          url: doOperationData.url,
          async: false,
          success: function (data, status, xhr) {
            console.log("'Success' called - data is: ", data);
             result = data;
          }
        });
        return result;
        //this proves that Google Pay integration works, but preset.js must be changed to also work asynchrinously.
      },
      onResult: summaryPageHandlerOnResult,
      proceedFunction: null
    }
  }, true);
}

//Render payment flow

$(document).ready(function() {
  generateTransactionID(inputData);
  readCartAmount("#cartAmount", 13);
/*
  $("#cartAmount").keypress(function(input) {
    var key = input.which;
    if (key == 13) {
      readCartAmount("#cartAmount", 13);
    }
  });
  */

  $("#listBtn").click(function() {
    loadList()
      .then(function(loadedList) {
        return modifyList(loadedList);
      })
      .then(function(list) {
        return listRequest(list);
      })
      .then(function(listResponse) {
        //loadPureNative(listResponse);
        loadIFrameSelectiveNative(listResponse);
        //loadIFrameHosted(listResponse);
      });
  });

  $("#submitBtn").click(function() {
    // Get iFrame for the currently selected radio button. Only works for non-grouped forms:
    console.log("Submit");
    //selected_iframe = $("#paymentNetworks input[type=radio][name=paymentType]:checked ~ .formContainer iframe").contentWindow;
    //selected_iframe.postMessage({"type": "payment_action"}, opg_origin);
    // Disable Pay button and show a spinner to indicate to the user that this may take a while...
  });

});

},{"escape-html":1}]},{},[2]);
