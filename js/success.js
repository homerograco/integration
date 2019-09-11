const checkoutUrl = "http://localhost:3000/checkout.html";
const summaryUrl = "http://localhost:3000/html/new_summary.html";
const cancelUrl = "http://localhost:3000/html/cancel.html";

$(document).ready(function() {
  $("#cancelBtn").click(function() {
    window.location.replace(cancelUrl);
  });
  $("#backSummaryBtn").click(function() {
    window.location.replace(summaryUrl);
  });
  $("#backCheckoutBtn").click(function() {
    window.location.replace(checkoutUrl);
  });
});
