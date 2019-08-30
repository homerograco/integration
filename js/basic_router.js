const express = require('express');
const bodyParser = require('body-parser');
const list = require('./list.js');
const port = 3000;
var app = express();

//uses express static to serve pages in public directory
app.use('/', express.static('../'));
//for test builds
app.use('/op-payment-widget', express.static('../../../ajax-library/op-payment-widget-v3-3.1.27'));
//for production builds
//app.use('/op-payment-widget', express.static('../../../ajax-library/op-payment-widget-v3-3.1.22/package/src'));
//for dev builds
//app.use('/op-payment-widget', express.static('../../../ajax-library/dev/op-payment-widget-v3/build'));

//body parser to read request element in express' GET and POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//can use some trick later to move all this app.post functions into a general one
app.post('/loadlist', function(request, response) {
  list.loadList().then(function(result) {
    response.send(result);
  });
});

app.post('/listrequest', function(request, response) {
  //console.log(request.body);
  list.listRequest(request.body).then(function(result) {
    response.send(result);
  });
});

app.post('/chargerequest', function(request, response) {
  list.chargeRequest().then(function(result) {
    response.send(result);
  });
});

app.post('/loadrequestedlist', function(request, response) {
  list.loadRequestedList().then(function(requestedList) {
    response.send(requestedList);
  });
});

app.post('/loadListLongId', function(request, response) {
  list.loadListLongId().then(function(responseListLongId) {
    response.send(responseListLongId);
  });
});

//listens to var 'port' in localhost
app.listen(port, function() {
  console.log('Server Running');
});
