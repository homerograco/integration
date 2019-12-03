const checkoutUrl = "http://localhost:3000/checkout.html";
const cancelUrl = "http://localhost:3000/html/cancel.html";

function enter() {
  keypress(function(keyboardInput) {
    let key = keyboardInput.which;
    if(key == '13') {
      return true;
    }
  });
}

function initPaymentPage() {
  //event.preventDefault();
  let listUrl = sessionStorage.getItem("listUrl");
  $('#paymentNetworks').checkoutList({
    payButton: "submitBtn",
    payButtonContainer: "submitBtnContainer",
    listUrl: listUrl,
    summaryPage: true,
    summaryPageHandler: {
       doOperation: function(data, callback) {
        console.log("doOperation function", data);
        $.ajax({
          type: data.method,
          dataType: "json",
          data: JSON.stringify(data.operationData ? data.operationData : {}),
          contentType: "application/json",
          url: data.url
        }).done(callback); //the merchant does have to define it. By standard it will be onResult function below.
      },
      onResult: function(result) {
        console.log("Result:", result);

        if (result.redirect) {
            window.location = result.redirect.url;
        }
      }
    }
  });
}

$(document).ready(function() {
  /* loadRequestedList().then(function(requestedList) {
    $("#total").append(requestedList.payment.amount);
  }); */
  //loadListLongId();
  initPaymentPage();
  $("#confirmBtn").click(function() {
    chargeRequest();
  });
  $("#cancelBtn").click(function() {
    window.location.replace(cancelUrl);
  });
  $("#backCheckoutBtn").click(function() {
    window.location.replace(checkoutUrl);
  });
  $("#cartTotal").append(sessionStorage.getItem("cartAmount"));
});
