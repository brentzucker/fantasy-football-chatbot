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

// bot.dialog('/', function (session) {
//     session.send("Hello World");
// });

bot.dialog('/', new builder.IntentDialog()
    .matches(/^hello/i, function (session) {
        session.beginDialog('/greeting', session.userData.profile);
    })
    .onDefault(function (session) {
        session.send("I didn't understand. Say hello to me!");
    }));

// bot.dialog('/', new builder.CommandDialog()
// 	.matches('^bot', '/greeting')
// 	.matches('^bot\sscores', '/scores')
// 	.matches('^bot\sstandings', '/standings')
// 	.matches('^bot\stransactions', '/transactions') 
// 	.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."))
// 	.beginDialogAction('/greeting')
// );

// bot.beginDialogAction('greeting', '/greeting', { matches: /^help/i });
// bot.beginDialogAction('scores', '/scores', { matches: /^scores/i });


bot.dialog('/greeting', function (session) {
	session.send("Hey I'm your fantasy football bot. I can tell you about scores, standings, and transactions. Try '/bot scores'");
	session.endDialog();
});

// bot.dialog('/scores', function (session) {
// 	session.send("Here are the scores");
// });

// bot.dialog('/standings', function (session) {
// 	session.send("Here are the standings");
// });

// bot.dialog('/transactions', function (session) {
// 	session.send("Here are the transactions");
// });