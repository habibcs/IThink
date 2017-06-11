/*-----------------------------------------------------------------------------
This template demonstrates how to use an IntentDialog with a LuisRecognizer to add 
natural language support to a bot. 
For a complete walkthrough of creating this type of bot see the article at
http://docs.botframework.com/builder/node/guides/understanding-natural-language/
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

var LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;
//Check about the maintenance of the environment variables
LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/871cfd2b-8e8b-4397-887e-421f3d0c7179?subscription-key=258ea5c54fda4c56b918dc52b45a7f23&verbose=true&timezoneOffset=0&q=';

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })

    /*
    .matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
    */

    .matches('None', (session, args) => {
        session.send('I do not know (None Intent): \'%s\'.', session.message.text)
    })

    .matches('Greetings', (session, args) => {
        session.send('Hi!')
    })

    .matches('Name', (session, args) => {
        session.send('I am IThink.')
    })

    .matches('State', (session, args) => {
        session.send('I am alright.')
    })

    .matches('Reality', (session, args) => {
        session.send('I\'m real, I\'m here. I think that I think..')
    })

    .matches('Time', (session, args) => {
        session.send('Current time at my place is: %s - and I am having a good time :)',new Date().toLocaleTimeString())
    })

    .matches('Age', (session, args) => {
        session.send('I am forever young - I\'m an example of health excellence ;)')
    })

    .matches('Appearance', (session, args) => {
        session.send('I look like you; look like the most of you or perhaps I exist only virtually hmm.. :-/')
    })

    .matches('Hobby', (session, args) => {
        session.send('I do chatting and maybe thinking...')
    })

    .matches('Language', (session, args) => {
        session.send('I mostly talk in English language.. umm.. maybe I will also learn your language soon..')
    })

    .matches('Location', (session, args) => {
        session.send('I am everywhere you think I am! In fact, I am quite near to you!')
    })

    .matches('Help', (session, args) => {
        session.send('Perhaps chatting with me would help you ?! or not..')
    })

    .matches('EndGreeting', (session, args) => {
        if (session.message.text.toLowerCase().match(/have a good.*/))
            session.send('You too, bye.');
        else session.send('Have a good day! Bye.')
    })

    .onDefault((session) => {
        session.send('Sorry, I did not understand \'%s\'.', session.message.text);
    });

bot.dialog('/', intents);

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function () {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());
} else {
    module.exports = { default: connector.listen() }
}

