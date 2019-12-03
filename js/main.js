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
!function(root, factory) {
    "object" == typeof exports && "object" == typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define("ZalgoPromise", [], factory) : "object" == typeof exports ? exports.ZalgoPromise = factory() : root.ZalgoPromise = factory();
}("undefined" != typeof self ? self : this, function() {
    return function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: !1,
                exports: {}
            };
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            module.l = !0;
            return module.exports;
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.d = function(exports, name, getter) {
            __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
                configurable: !1,
                enumerable: !0,
                get: getter
            });
        };
        __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ? function() {
                return module.default;
            } : function() {
                return module;
            };
            __webpack_require__.d(getter, "a", getter);
            return getter;
        };
        __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        };
        __webpack_require__.p = "";
        return __webpack_require__(__webpack_require__.s = "./src/index.js");
    }({
        "./src/index.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            Object.defineProperty(__webpack_exports__, "__esModule", {
                value: !0
            });
            function utils_isPromise(item) {
                try {
                    if (!item) return !1;
                    if ("undefined" != typeof Promise && item instanceof Promise) return !0;
                    if ("undefined" != typeof window && window.Window && item instanceof window.Window) return !1;
                    if ("undefined" != typeof window && window.constructor && item instanceof window.constructor) return !1;
                    var _toString = {}.toString;
                    if (_toString) {
                        var name = _toString.call(item);
                        if ("[object Window]" === name || "[object global]" === name || "[object DOMWindow]" === name) return !1;
                    }
                    if ("function" == typeof item.then) return !0;
                } catch (err) {
                    return !1;
                }
                return !1;
            }
            function getGlobal() {
                var glob = void 0;
                if ("undefined" != typeof window) glob = window; else {
                    if ("undefined" == typeof window) throw new TypeError("Can not find global");
                    glob = window;
                }
                var zalgoGlobal = glob.__zalgopromise__ = glob.__zalgopromise__ || {};
                zalgoGlobal.flushPromises = zalgoGlobal.flushPromises || [];
                zalgoGlobal.activeCount = zalgoGlobal.activeCount || 0;
                zalgoGlobal.possiblyUnhandledPromiseHandlers = zalgoGlobal.possiblyUnhandledPromiseHandlers || [];
                zalgoGlobal.dispatchedErrors = zalgoGlobal.dispatchedErrors || [];
                return zalgoGlobal;
            }
            var promise_ZalgoPromise = function() {
                function ZalgoPromise(handler) {
                    var _this = this;
                    !function(instance, Constructor) {
                        if (!(instance instanceof ZalgoPromise)) throw new TypeError("Cannot call a class as a function");
                    }(this);
                    this.resolved = !1;
                    this.rejected = !1;
                    this.errorHandled = !1;
                    this.handlers = [];
                    if (handler) {
                        var _result = void 0, _error = void 0, resolved = !1, rejected = !1, isAsync = !1;
                        try {
                            handler(function(res) {
                                if (isAsync) _this.resolve(res); else {
                                    resolved = !0;
                                    _result = res;
                                }
                            }, function(err) {
                                if (isAsync) _this.reject(err); else {
                                    rejected = !0;
                                    _error = err;
                                }
                            });
                        } catch (err) {
                            this.reject(err);
                            return;
                        }
                        isAsync = !0;
                        resolved ? this.resolve(_result) : rejected && this.reject(_error);
                    }
                }
                ZalgoPromise.prototype.resolve = function(result) {
                    if (this.resolved || this.rejected) return this;
                    if (utils_isPromise(result)) throw new Error("Can not resolve promise with another promise");
                    this.resolved = !0;
                    this.value = result;
                    this.dispatch();
                    return this;
                };
                ZalgoPromise.prototype.reject = function(error) {
                    var _this2 = this;
                    if (this.resolved || this.rejected) return this;
                    if (utils_isPromise(error)) throw new Error("Can not reject promise with another promise");
                    if (!error) {
                        var _err = error && "function" == typeof error.toString ? error.toString() : Object.prototype.toString.call(error);
                        error = new Error("Expected reject to be called with Error, got " + _err);
                    }
                    this.rejected = !0;
                    this.error = error;
                    this.errorHandled || setTimeout(function() {
                        _this2.errorHandled || function(err, promise) {
                            if (-1 === getGlobal().dispatchedErrors.indexOf(err)) {
                                getGlobal().dispatchedErrors.push(err);
                                setTimeout(function() {
                                    throw err;
                                }, 1);
                                for (var j = 0; j < getGlobal().possiblyUnhandledPromiseHandlers.length; j++) getGlobal().possiblyUnhandledPromiseHandlers[j](err, promise);
                            }
                        }(error, _this2);
                    }, 1);
                    this.dispatch();
                    return this;
                };
                ZalgoPromise.prototype.asyncReject = function(error) {
                    this.errorHandled = !0;
                    this.reject(error);
                };
                ZalgoPromise.prototype.dispatch = function() {
                    var _this3 = this, dispatching = this.dispatching, resolved = this.resolved, rejected = this.rejected, handlers = this.handlers;
                    if (!dispatching && (resolved || rejected)) {
                        this.dispatching = !0;
                        getGlobal().activeCount += 1;
                        for (var _loop = function(i) {
                            var _handlers$i = handlers[i], onSuccess = _handlers$i.onSuccess, onError = _handlers$i.onError, promise = _handlers$i.promise, result = void 0;
                            if (resolved) try {
                                result = onSuccess ? onSuccess(_this3.value) : _this3.value;
                            } catch (err) {
                                promise.reject(err);
                                return "continue";
                            } else if (rejected) {
                                if (!onError) {
                                    promise.reject(_this3.error);
                                    return "continue";
                                }
                                try {
                                    result = onError(_this3.error);
                                } catch (err) {
                                    promise.reject(err);
                                    return "continue";
                                }
                            }
                            if (result instanceof ZalgoPromise && (result.resolved || result.rejected)) {
                                result.resolved ? promise.resolve(result.value) : promise.reject(result.error);
                                result.errorHandled = !0;
                            } else utils_isPromise(result) ? result instanceof ZalgoPromise && (result.resolved || result.rejected) ? result.resolved ? promise.resolve(result.value) : promise.reject(result.error) : result.then(function(res) {
                                promise.resolve(res);
                            }, function(err) {
                                promise.reject(err);
                            }) : promise.resolve(result);
                        }, i = 0; i < handlers.length; i++) _loop(i);
                        handlers.length = 0;
                        this.dispatching = !1;
                        getGlobal().activeCount -= 1;
                        0 === getGlobal().activeCount && ZalgoPromise.flushQueue();
                    }
                };
                ZalgoPromise.prototype.then = function(onSuccess, onError) {
                    if (onSuccess && "function" != typeof onSuccess && !onSuccess.call) throw new Error("Promise.then expected a function for success handler");
                    if (onError && "function" != typeof onError && !onError.call) throw new Error("Promise.then expected a function for error handler");
                    var promise = new ZalgoPromise();
                    this.handlers.push({
                        promise: promise,
                        onSuccess: onSuccess,
                        onError: onError
                    });
                    this.errorHandled = !0;
                    this.dispatch();
                    return promise;
                };
                ZalgoPromise.prototype.catch = function(onError) {
                    return this.then(void 0, onError);
                };
                ZalgoPromise.prototype.finally = function(onFinally) {
                    if (onFinally && "function" != typeof onFinally && !onFinally.call) throw new Error("Promise.finally expected a function");
                    return this.then(function(result) {
                        return ZalgoPromise.try(onFinally).then(function() {
                            return result;
                        });
                    }, function(err) {
                        return ZalgoPromise.try(onFinally).then(function() {
                            throw err;
                        });
                    });
                };
                ZalgoPromise.prototype.timeout = function(time, err) {
                    var _this4 = this;
                    if (this.resolved || this.rejected) return this;
                    var timeout = setTimeout(function() {
                        _this4.resolved || _this4.rejected || _this4.reject(err || new Error("Promise timed out after " + time + "ms"));
                    }, time);
                    return this.then(function(result) {
                        clearTimeout(timeout);
                        return result;
                    });
                };
                ZalgoPromise.prototype.toPromise = function() {
                    if ("undefined" == typeof Promise) throw new TypeError("Could not find Promise");
                    return Promise.resolve(this);
                };
                ZalgoPromise.resolve = function(value) {
                    return value instanceof ZalgoPromise ? value : utils_isPromise(value) ? new ZalgoPromise(function(resolve, reject) {
                        return value.then(resolve, reject);
                    }) : new ZalgoPromise().resolve(value);
                };
                ZalgoPromise.reject = function(error) {
                    return new ZalgoPromise().reject(error);
                };
                ZalgoPromise.all = function(promises) {
                    var promise = new ZalgoPromise(), count = promises.length, results = [];
                    if (!count) {
                        promise.resolve(results);
                        return promise;
                    }
                    for (var _loop2 = function(i) {
                        var prom = promises[i];
                        if (prom instanceof ZalgoPromise) {
                            if (prom.resolved) {
                                results[i] = prom.value;
                                count -= 1;
                                return "continue";
                            }
                        } else if (!utils_isPromise(prom)) {
                            results[i] = prom;
                            count -= 1;
                            return "continue";
                        }
                        ZalgoPromise.resolve(prom).then(function(result) {
                            results[i] = result;
                            0 == (count -= 1) && promise.resolve(results);
                        }, function(err) {
                            promise.reject(err);
                        });
                    }, i = 0; i < promises.length; i++) _loop2(i);
                    0 === count && promise.resolve(results);
                    return promise;
                };
                ZalgoPromise.hash = function(promises) {
                    var result = {};
                    return ZalgoPromise.all(Object.keys(promises).map(function(key) {
                        return ZalgoPromise.resolve(promises[key]).then(function(value) {
                            result[key] = value;
                        });
                    })).then(function() {
                        return result;
                    });
                };
                ZalgoPromise.map = function(items, method) {
                    return ZalgoPromise.all(items.map(method));
                };
                ZalgoPromise.onPossiblyUnhandledException = function(handler) {
                    return function(handler) {
                        getGlobal().possiblyUnhandledPromiseHandlers.push(handler);
                        return {
                            cancel: function() {
                                getGlobal().possiblyUnhandledPromiseHandlers.splice(getGlobal().possiblyUnhandledPromiseHandlers.indexOf(handler), 1);
                            }
                        };
                    }(handler);
                };
                ZalgoPromise.try = function(method, context, args) {
                    if (method && "function" != typeof method && !method.call) throw new Error("Promise.try expected a function");
                    var result = void 0;
                    try {
                        result = method.apply(context, args || []);
                    } catch (err) {
                        return ZalgoPromise.reject(err);
                    }
                    return ZalgoPromise.resolve(result);
                };
                ZalgoPromise.delay = function(_delay) {
                    return new ZalgoPromise(function(resolve) {
                        setTimeout(resolve, _delay);
                    });
                };
                ZalgoPromise.isPromise = function(value) {
                    return !!(value && value instanceof ZalgoPromise) || utils_isPromise(value);
                };
                ZalgoPromise.flush = function() {
                    var promise = new ZalgoPromise();
                    getGlobal().flushPromises.push(promise);
                    0 === getGlobal().activeCount && ZalgoPromise.flushQueue();
                    return promise;
                };
                ZalgoPromise.flushQueue = function() {
                    var promisesToFlush = getGlobal().flushPromises;
                    getGlobal().flushPromises = [];
                    for (var _i2 = 0, _length2 = null == promisesToFlush ? 0 : promisesToFlush.length; _i2 < _length2; _i2++) promisesToFlush[_i2].resolve();
                };
                return ZalgoPromise;
            }();
            __webpack_require__.d(__webpack_exports__, "ZalgoPromise", function() {
                return promise_ZalgoPromise;
            });
        }
    });
});


},{}],3:[function(require,module,exports){
/* @flow */

// eslint-disable-next-line import/no-commonjs
module.exports = require('./dist/zalgo-promise');

},{"./dist/zalgo-promise":2}],4:[function(require,module,exports){
var escapeHtml = require("escape-html");
var zalgoPromise = require('zalgo-promise');
//var opPaymentWidget = require('./src/js/op-payment-widget-v3.js');
var responseData = "";
var inputData = {
  transactionId: "",
  cartAmount: 0,
  integrationScenario: "PURE_NATIVE"
};

//Helper functions

var randomId = (min, max) => "id" + Math.floor(Math.random() * (max - min)) + min


function generateTransactionID() {
  min = 0;
  max = 100000;
  //The maximum is exclusive and the minimum is inclusive
  inputData.transactionId = randomId(min, max);
  //inputData.transactionId = "id123456";
  sessionStorage.setItem("transactionId", inputData.transactionId);
  console.log("Transaction ID: ", inputData.transactionId);
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

  var deferred = $.Deferred();
  deferred.done();
  $(cartInputId).keypress(function(keyboardInput) {
    let key = keyboardInput.which;
    if (key == keyId) {
      //Reads shopping cart value
      inputData.cartAmount = $(cartInputId).val();
      sessionStorage.setItem("cartAmount", inputData.cartAmount);
      console.log("Cart amount: ", inputData.cartAmount);
    }
  });
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
    //newList.products[0].amount = inputData.cartAmount;
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
    sessionStorage.setItem("listUrl", data.links.self);
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
  $("#paymentNetworks").checkoutList({
    payButton: "submitBtn",
    payButtonContainer: "submitBtnContainer",
    baseUrl: "https://api.sandbox.oscato.com/pci/v1/",
    listUrl: responseData.links.self,
    smartSwitch: true,
    liveValidation: true,
    cardView: false,

    /*
        abortFunction: function(responseData) {
          console.log("Abort: ", responseData)
        },
        */
/*
    proceedFunction: function(responseData) {
      if(responseData.interaction.code == "RETRY") {
        console.log("Retry? ", responseData);
      } else {
        console.log("Some other case", responseData);
      }
    }
*/
    /* //Uncomment this part for single-page app
          proceedFunction: function(proceedResponse) {
            $("#paymentNetworks").empty();
            //loadSummaryPage(responseData, proceedResponse);
            loadSummaryPage(responseData, proceedResponse);
          }
          */

  }, false);
  $("#submitBtn").show();
  //$("#cartAmount").attr("disabled", true);
  //$("#listBtn").attr("disabled", true);
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
  readCartAmount("#cartAmount", 13);

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
        loadSelectiveNative(listResponse);
        //manualSelectiveNative(listResponse);
        //loadIFrameHosted(listResponse);
      });
  });
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

},{"escape-html":1,"zalgo-promise":3}]},{},[4]);
