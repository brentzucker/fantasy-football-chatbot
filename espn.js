var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Test Endpoint
server.get('/', function(req, res, next) {
  res.send('hello');
  return next();
});