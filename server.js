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
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

// bot.dialog('/', function (session) {
//     session.send("Hello World");
// });

bot.dialog('/', new builder.IntentDialog()
	.matches('/^bot/i', '/greeting')
	.matches('/^bot\sscores/i', '/scores')
	.matches('/^bot\sstandings/i', '/standings')
	.matches('/^bot\stransactions/i', '/transactions') 
	.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."))
);

bot.dialog('/greeting', function (session) {
	session.send("Hey I'm your fantasy football bot. I can tell you about scores, standings, and transactions. Try '/bot scores'");
});

bot.dialog('/scores', function (session) {
	session.send("Here are the scores");
});

bot.dialog('/standings', function (session) {
	session.send("Here are the standings");
});

bot.dialog('/transactions', function (session) {
	session.send("Here are the transactions");
});