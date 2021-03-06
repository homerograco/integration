(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var escapeHtml = require("escape-html");

var responseData = "";
var inputData = {
  transactionId: "",
  cartAmount: null,
  integrationScenario: "PURE_NATIVE"
};

var editor;

//Helper functions

//Not used atm. Will be part of the "Insomnia killer app".
function startEditor(editor) {
  editor = CodeMirror.fromTextArea(document.getElementById("list_request"),
		{
			theme: "ayu-dark",
			mode: "application/ld+json",
			lineNumbers: true,
			matchBrackets: true,
			lineWrapping: true
		}
	);
  return editor;
}

var randomId = (min, max) => "id" + Math.floor(Math.random() * (max - min)) + min
//for IE
//var randomId = "ie15t5h3155";


function generateTransactionID() {
  min = 0;
  max = 100000;
  //The maximum is exclusive and the minimum is inclusive
  inputData.transactionId = randomId(min, max);
  //for IE
  //inputData.transactionId = "id123456";
  sessionStorage.setItem("transactionId", inputData.transactionId);
  console.log("Transaction ID:", inputData.transactionId);
}

/*
function readCartAmount(cartInputId, keyId) {
  //reads cart amount from cartInputId via keyboard input indicated by keyId.
  //keyId = 13 for "Enter" key.

  var deferred = $.Deferred();
  deferred.done();
  $(cartInputId).keypress(function(keyboardInput) {
    let key = keyboardInput.which;
    if (key == keyId) {
      //Reads shopping cart value
      inputData.cartAmount = $(cartInputId).val();
      sessionStorage.setItem("cartAmount", inputData.cartAmount);
      console.log("Cart amount:", inputData.cartAmount);
    }
  });
}
*/

function readCartAmount(cartInputId, keyId) {
  //reads cart amount from cartInputId via keyboard input indicated by keyId.
  //keyId = 13 for "Enter" key.
  $(cartInputId).keypress(function(keyboardInput) {
    let key = keyboardInput.which;
    inputData.cartAmount = $(cartInputId).val();
    if (key == keyId) {
      //Reads shopping cart value
      inputData.cartAmount = $(cartInputId).val();
      sessionStorage.setItem("cartAmount", inputData.cartAmount);
      console.log("Cart amount:", inputData.cartAmount);
      triggerList();
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
    if(inputData.cartAmount != null && inputData.cartAmount !== "") {
      newList.payment.amount = inputData.cartAmount;
      newList.products[0].amount = inputData.cartAmount;
    }
    console.log("LIST Request: ", newList);
    return newList;
  } else {
    return Error("Problem loading list");
  }
}

function listRequest(list) {
  /* Makes a list request to the server */

  var listJSON = JSON.stringify(list);
  //var listJSON = editor.doc.getValue();
  var ajax = $.ajax({
    type: "POST",
    contentType: 'application/json; charset=utf-8',
    data: listJSON,
    dataType: "json",
    url: "http://localhost:3000/listrequest"
  }).then(function(data) {
    sessionStorage.setItem("listUrl", data.links.self);
    console.log("LIST Response: ", data);
    return data;
  });
  return ajax;
}

function triggerList() {
//  $("#listBtn").click(function() {

    loadList()
      .then(function(loadedList) {
        return modifyList(loadedList);
      })
      .then(function(list) {
        return listRequest(list);
      })
      //listRequest(editor)
      .then(function(listResponse) {
        //loadPureNative(listResponse);
        loadSelectiveNative(listResponse);
        //manualSelectiveNative(listResponse);
        //loadIFrameHosted(listResponse);
      });
  //});
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
      //showGlobalSuccessMessage("Payment is done!")
      window.open(data.redirect.url, '_blank');
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
  var iFrameSettings = {
    src: responseData.redirect.url,
    id: "payment-widget",
    width: "100%",
    height: $(window).height() + "px"
  };
  /*
  var deferred = $.Deferred();
  var iFrame = $("<iframe class='hiddenFrame'></iframe>").attr({
    "id": "payment-widget",
    "src": responseData.redirect.url,
    "width": "100%",
    "height": "341px"
  });
  iFrame.load(deferred.resolve);
  console.log("first");
  deferred.done(function() {
    console.log("second");
  });
  */

  iFrame = document.createElement("iframe");
  iFrame.setAttribute("src", iFrameSettings.src);
  iFrame.setAttribute("id", iFrameSettings.id);
  iFrame.setAttribute("width", iFrameSettings.width);
  iFrame.setAttribute("height", iFrameSettings.height);

  $("#paymentNetworks").append(iFrame);
  $("#submitBtn").hide();
  $("#cartAmount").attr("disabled", true);
  $("#listBtn").attr("disabled", true);

  //return deferred.promise();
}

function manualSelectiveNative(data) {
  let responseData = data;
  var visaIframe = responseData.networks.applicable[0].links.iFrame;
  var selected_iframe = $("#paymentNetworks").attr("src", visaIframe);

  $("#submitBtn").click(function() {
    console.log("submit");
    var opg_origin = 'https://resources.sandbox.oscato.com/';
    // Get iFrame for the currently selected radio button. Only works for non-grouped forms:
    //selected_iframe = $("#paymentNetworks input[type=radio][name=paymentType]:checked ~ .formContainer iframe").contentWindow;
    //selected_iframe = $("#paymentNetworks").attr("src", visaIframe);
    selected_iframe.postMessage({
      "type": "payment_action"
    }, "https://resources.sandbox.oscato.com/");
    // Disable Pay button and show a spinner to indicate to the user that this may take a while...
  });

}

function loadSelectiveNative(data) {
  let responseData = data;
  if ($("#paymentNetworksContainer").attr("class") == "show") {
    $("#paymentNetworks").empty();
    //how do I clean it before loading?
  } else {
    $("#paymentNetworks").checkoutList({
      payButton: "submitBtn",
      payButtonContainer: "submitBtnContainer",
      baseUrl: "https://api.sandbox.oscato.com/pci/v1/",
      listUrl: responseData.links.self,
      smartSwitch: true,
      liveValidation: true,
      cardView: false,


          //abortFunction: function(responseData) {
            //console.log("Abort: ", responseData)
          //},

          //immediate Charge
          //proceedFunction: function(responseData) {
            //if(responseData.redirect.method = "GET") {
              //window.open(responseData.redirect.url, '_blank');
            //}
          //}

      //Uncomment this part for single-page app
      proceedFunction: function(proceedResponse) {
        $("#paymentNetworks").empty();
        loadSummaryPage(responseData, proceedResponse);
      }


    });
    $("#paymentNetworksContainer").attr("class", "show");
    //$("#cartAmount").attr("disabled", true);
    //$("#listBtn").attr("disabled", true);
  }
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

function loadContinue(inputData, proceedData) {
  console.log("Proceed Data: ", proceedData);
  console.log("LIST Response: ", inputData);
  $("#paymentNetworks").html("<button id = 'continueBtn' type = 'button'>Continue</button>");
  $("#continueBtn").click(function() {
    console.log("Continue clicked");
    loadSummaryPage(inputData, proceedData); //load it before but keep it hidden
  });
  $.ajax({
    type: "POST",
    dataType: "json",
    data: JSON.stringify({}),
    contentType: "application/json",
    url: inputData.links.self + "/charge"
  }).done(function(response) {
    console.log("CHARGE Response: ", response);
  });
}

function loadSummaryPage(inputData, proceedData) {
  let providerResponse;
  console.log("Proceed Data: ", proceedData);
  console.log("Input Data", inputData);
  //$("#paymentNetworks").html("<button id = 'continueBtn' type = 'button'>Continue</button>");
  $("#paymentNetworks").checkoutList({
    payButton: "submitBtn",
    payButtonContainer: "submitBtnContainer",
    listUrl: inputData.links.self,
    summaryPage: true,
    summaryPageHandler: {
      /*
      doOperation: function(data, callback) {
        console.log("providerResponse: ", providerResponse);
        var deferredToken = new Promise((resolve, reject) => {
          if (providerResponse.parameters[0].name == "token") {
            var token = providerResponse.parameters[0].value;
            let chargeResult = {
              interaction: {
                code: "PROCEED"
              },
              redirect: {
                url: "https://www.example.com?token=" + providerResponse.parameters[0].value
              }
            }
            callback(chargeResult);
            resolve(token);
          } else {
            reject("Token not found");
          }
        });
        console.log("Token: ", deferredToken);
        return deferredToken;
      },
      */

      doOperation: function(data, callBack) {
        console.log("doOperation Data: ", data);
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

  //$("#submitBtnContainer").hide();
  /*
  $("#continueBtn").click(function() {
    console.log("Continue clicked");
    $.ajax({
      type: "POST",
      dataType: "json",
      data: JSON.stringify({}),
      contentType: "application/json",
      url: inputData.links.self + "/charge" //perhaps I need to pass this data back to doOperation()
    }).done(function(response) {
      console.log("CHARGE response: ", response);
      providerResponse = response.providerResponse;
      $("#submitBtnContainer").show();
      $("#continueBtn").hide();
    });
  });
  */

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
          success: function(data, status, xhr) {
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
  generateTransactionID();
  //editor = startEditor(editor);
  //console.log(editor);
  readCartAmount("#cartAmount", 13);

  //triggerList();

  /* $("#submitBtn").click(function() {
    // Get iFrame for the currently selected radio button. Only works for non-grouped forms:
    console.log("Submit");
    //selected_iframe = $("#paymentNetworks input[type=radio][name=paymentType]:checked ~ .formContainer iframe").contentWindow;
    //selected_iframe.postMessage({"type": "payment_action"}, opg_origin);
    // Disable Pay button and show a spinner to indicate to the user that this may take a while...
  });
  */

  //confirm button used in the summary page
  $("#confirmBtn").click(function() {
    console.log("Confirmed");
  });

  //cancel button used in the summary page
  $("#cancelBtn").click(function() {
    window.location.replace("www.google.com");
  });

});

/*
$(document).ready(function() {
  generateTransactionID();
  readCartAmount("#cartAmount", 13);
  loadList()
    .then(function(loadedList) {
      return modifyList(loadedList);
    })
    .then(function(list) {
      return listRequest(list);
    })
    .then(function(listResponse) {
      loadSelectiveNative(listResponse);
    });

  $("#submitBtn").click(function() {
    // Get iFrame for the currently selected radio button. Only works for non-grouped forms:
    console.log("Submit");
    //selected_iframe = $("#paymentNetworks input[type=radio][name=paymentType]:checked ~ .formContainer iframe").contentWindow;
    //selected_iframe.postMessage({"type": "payment_action"}, opg_origin);
    // Disable Pay button and show a spinner to indicate to the user that this may take a while...
  });

  //confirm button used in the summary page
  $("#confirmBtn").click(function() {
    console.log("Confirmed");
  });

  //cancel button used in the summary page
  $("#cancelBtn").click(function() {
    window.location.replace("www.google.com");
  });

});
*/

},{"escape-html":2}],2:[function(require,module,exports){
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

},{}]},{},[1]);
