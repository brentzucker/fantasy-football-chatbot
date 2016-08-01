var restify = require('restify');
var builder = require('botbuilder');

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
    .onDefault(function (session) {
        session.send("I didn't understand. Say hello to me!");
    })
);

bot.dialog('/greeting', function (session) {
	session.send("Hey I'm your fantasy football bot. I can tell you about scores, standings, and transactions. Try '/bot scores'");
	session.endDialog();
});

bot.dialog('/scores', function (session) {
	session.send("Here are the scores");
	session.endDialog();
});

bot.dialog('/standings', function (session) {
	session.send("Here are the standings");
	session.endDialog();
});

bot.dialog('/transactions', function (session) {
	session.send("Here are the transactions");
	session.endDialog();
});