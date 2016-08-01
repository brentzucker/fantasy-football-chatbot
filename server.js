'use strict';
var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');
var iconvlite = require('iconv-lite');
var cheerio = require("cheerio");

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);

// Handle Bot Framework messages
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', new builder.IntentDialog()
    .matches(/^bot\shello/i, function (session) {
        session.beginDialog('/greeting', session.userData.profile);
    })
    .matches(/^bot\sscores/i, function (session) {
        session.beginDialog('/scores', session.userData.profile);
    })    
    .matches(/^bot\sstandings/i, function (session) {
        session.beginDialog('/standings', session.userData.profile);
    })
    .matches(/^bot\stransactions/i, function (session) {
        session.beginDialog('/transactions', session.userData.profile);
    })
    .matches(/^bot/i, function (session) {
        session.beginDialog('/greeting', session.userData.profile);
    })
    .matches(/^bot\s/i, function (session) {
        session.send("I didn't understand. Say hello to me!");
    })
);

bot.dialog('/greeting', function (session) {
	session.send("Hey I'm your fantasy football bot. I can tell you about scores, standings, and transactions. Try 'bot scores'");
	session.endDialog();
});

bot.dialog('/scores', function (session) {
	session.send("Here are the scores");
	session.endDialog();
});

bot.dialog('/standings', function (session) {
	// session.send("Here are the standings");
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

	        // Parse the HTML 
			let $ = cheerio.load(content);

			var standings_list = [];
			$('tr[class=tableBody]').each(function(i, elemI) {
				var entry = [];
				$(this).children().each(function(j, elemJ) {
					console.log($(this).text());
					entry.push($(this).text());
				})
				standings_list.push(entry);
			});

			// calculate longest team name
			var max = -1;
			for (var i = 0; i < standings_list.length; i++) {
				if (standings_list[i][0].length > max) {
					max = standings_list[i][0].length;
				}
			}

			// add padding
			max += 5;

			// Generate standings string
			var standings = [];
			for (var i = 0; i < standings_list.length; i++) {
				var s = standings_list[i];

				var rank = (i+1) + '.';
				var teamName = s[0];
				var record = s[1] + '-' + s[2] + '-' + s[3];
				var winPercentage = s[4];
				
				var str = rank + ' ' + teamName + ' '.repeat(max - teamName.length) + record + ' ' + winPercentage;

				standings.push(str);
			}

	        session.send(standings);
	        session.endDialog();
	    }
	});
});

bot.dialog('/transactions', function (session) {
	session.send("Here are the transactions");
	session.endDialog();
});