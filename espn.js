var restify = require('restify');
var request = require('request');
var iconvlite = require('iconv-lite');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Test Endpoint
server.get('/', function(req, res, next) {
	var headers = {
	    'Accept-Language': 'en-US,en;q=0.8',
	    'Upgrade-Insecure-Requests': '1',
	    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
	    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	    'Referer': 'http://games.espn.go.com/flb/leagueoffice?leagueId=182799&seasonId=2016',
	    'Connection': 'keep-alive',
		'Cookie': process.env.COOKIE
	};

	var options = {
	    url: 'http://games.espn.go.com/flb/standings?leagueId=182799&seasonId=2016',
	    headers: headers,
	    encoding: null
	};

	request(options, function(error, response, body) {
	    if (!error && response.statusCode == 200) {
	    	var encoding = 'ISO-8859-1';
       		var content = iconvlite.decode(body, encoding);
	        // console.log(content);
	        res.send(content);
	        return next();
	    }
	});
});