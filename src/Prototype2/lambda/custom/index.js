//enable ES6 functionality, be as strict as possible in treating vars/lets
'use strict';
const Alexa = require("alexa-sdk");
const Helper = require("./lib/helper.js");
const AlexaStrings = require("./lib/strings.js");
// if resolving to an external endpoint
//const https = require('https');
// for logging. Take it from App_ID in Alexa Developer Console
// REMOVED HERE TO NOT COLLIDE WITH THE IRELAND INSTANCE!
//const APP_ID = 'amzn1.ask.skill.9c23a9d7-4b4e-4349-a7d6-d2ee05243a31';

// For detailed tutorial on how to making a Alexa skill,
// please visit us at http://alexa.design/build


exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    var locale = event.request.locale;
    console.log(event)
    // registration for a multiligual skill - will define speech output based on locale
    // an extended alexa.registerHandlers(handlers); //you can register multiple handlers at once
    if (locale == 'de-DE'){
        alexa.registerHandlers(DE_handlers);
        console.log('registered german handler');
    } else if (locale == 'fr-FR') {
        alexa.registerHandlers(FR_handlers);
        console.log('registered french handler');
    } else { //basically if locale.toString().startsWith('en')
        alexa.registerHandlers(EN_US_handlers);
        console.log('registered US-English handler');
    }
    // was changed from alexa.APP_ID
    alexa.appId = APP_ID;
    alexa.execute();
};


//constructor for node tests


//we will check for the locale inside the request
var DE_handlers = {

    // 'NewSession': function() {
    //     console.log("in NewSession");
    //     // when you have a new session,
    //     // this is where you'll
    //     // optionally initialize
    //
    //     // after initializing, continue on
    //     routeToIntent.call(this);
    // },


    'LaunchRequest': function () {
        console.log("in LaunchRequest");
        this.emit('SayHello');
    },
    // 'MyNameIsIntent': function () {
    //     this.emit('SayHelloName');
    // },
    'static_PersonalAusweisIntent' : function () {
        console.log("in PersonalAusweisIntent");
        this.emit('SayPersonalAusweisInfo'); //TODO then PA_kosten, then etc.
    },

    'openingHoursIntent': function () {
        // delegate to Alexa to collect all the required slots
        let isTestingWithSimulator = true; //autofill slots when using simulator, dialog management is only supported with a device

        console.log("in OpeningHoursIntent");

        //TODO get right opening hours

        this.emit('SayOpeningHours')
    },

    //  Fulfillment //

    'SayHello': function () {
        //uncomment this for default option
        //this.response.speak(AlexaStrings.defaultSpokenStrings.de.INTRO_GREETING_TEXT[0]);
        this.response.speak(Helper.getRandomResponseUtterance(AlexaStrings.defaultSpokenStrings.de.INTRO_GREETING_TEXT));

        //TODO: can make her whisper here using ssml
        // https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html
        //https://stackoverflow.com/questions/41776014/how-to-correctly-specify-ssml-in-an-alexa-skill-lambda-function
        this.response.listen('Talk to me in German.')
        //if the card is made of two vars, then sth, else if 3 vars then title and image
            .cardRenderer(AlexaStrings.defaultCardStrings.de.INTRO_GREETING_TEXT[0], AlexaStrings.defaultCardStrings.de.INTRO_GREETING_TEXT[1]);
        this.emit(':responseReady');
    },
    //TODO
    'SayPersonalAusweisInfo': function () {
        //var district = this.event.request.intent.slots.District.value;
        this.response.speak(Helper.getRandomResponseUtterance(AlexaStrings.defaultSpokenStrings.de.INTRO_WIP_TEXT));
        this.response.speak(AlexaStrings.Dienstleistung_IntentSpokenStrings.de.PersoIntent);
        this.emit(':responseReady')
    },


    //TODO
    'SayOpeningHours': function () {
        var district = this.event.request.intent.slots.District.value;
        this.response.speak('You are in ' + district);
        this.response.speak(AlexaStrings.defaultSpokenStrings.de.INTRO_WIP_TEXT);
        this.response.speak('Allerdings kann ich dir sagen, dass ein Bürgeramt in der Nähe bestimmt auf hat');

        this.emit(':responseReady')
    },



    'SayHelloName': function () {
        var name = this.event.request.intent.slots.name.value;
        this.response.speak('Hello ' + name)
            .cardRenderer('hello world', 'hello ' + name);
        this.emit(':responseReady');
    },



    // Defaults + Housekeeping //
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak(AlexaStrings.defaultSpokenStrings.de.INTRO_STOP_TEXT);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak(AlexaStrings.defaultSpokenStrings.en.INTRO_HELP_TEXT);

        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak(AlexaStrings.defaultSpokenStrings.en.INTRO_HELP_TEXT);
    }

};

var EN_US_handlers = {
    'HelloWorldIntent': function () {
        this.emit('SayHello');
    },
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak(AlexaStrings.defaultSpokenStrings.en.INTRO_STOP_TEXT);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak(AlexaStrings.defaultSpokenStrings.en.INTRO_HELP_TEXT);
        // should not stop here, but continue listning
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak(AlexaStrings.defaultSpokenStrings.en.INTRO_CANCEL_TEXT);
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak(AlexaStrings.defaultSpokenStrings.en.INTRO_HELP_TEXT);
    }

};

var FR_Handlers = {};











