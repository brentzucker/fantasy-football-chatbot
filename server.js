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
	.matches('/^bot scores/i', '/scores')
	.matches('/^bot standings/i', '/standings')
	.matches('/^bot transactions/i', '/transactions') 
	.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."))
);

bot.dialog('/scores', function (session) {
	session.send("Here are the scores");
});

bot.dialog('/standings', function (session) {
	session.send("Here are the standings");
});

bot.dialog('/transactions', function (session) {
	session.send("Here are the transactions");
});