//enable ES6 functionality, be as strict as possible in treating vars/lets  //import from
'use strict';
const Alexa = require("alexa-sdk");
const Helper = require("./lib/helper.js");
const AlexaStrings = require("./lib/strings.js");
// if resolving to an external endpoint
//const https = require('https');
// for logging. Take it from App_ID in Alexa Developer Console
//ID of Protoype2 - se documetation
// const APP_ID = 'amzn1.ask.skill.9c23a9d7-4b4e-4349-a7d6-d2ee05243a31';
//deleted
// const APP_ID = 'amzn1.ask.skill.6052bd23-1604-4531-b3ee-d46c42cc1df0';
//one that was not found
//      "skill_id": "amzn1.ask.skill.309892aa-9ea3-4752-bbc1-3b017b1e40d4",
//this one is called Prototype2 but that bug should be corrected once sent for launch
const APP_ID = 'amzn1.ask.skill.64e518f2-a728-4fdb-97a1-6f086f864692';

// For detailed tutorial on how to making a Alexa skill,
// please visit us at http://alexa.design/build






// prefer to define parameters like ‘:responseReady’ to make autoComplete  and  code snippets easy on any basic IDE
// and avoid typos, however it is not necessary if it makes code more complicated.

const nodeEvents = {
    'RESPONSE_READY': ':responseReady'
}




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

AlexaStrings
//constructor for node tests


//we will not  check for the locale inside the request, but register the handler
// based on the locale instead at the beginning. see above

//TODO Aufenthaltstitel example deutsch
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
        //this.response.speak(AlexaStrings.defaultSpokenStrings.de.GREETING_TEXT[0]);
        this.response.speak(Helper.getRandomResponseUtterance(AlexaStrings.defaultSpokenStrings.de.GREETING_TEXT));

        //TODO: can make her whisper here using ssml
        // https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html
        //https://stackoverflow.com/questions/41776014/how-to-correctly-specify-ssml-in-an-alexa-skill-lambda-function
        this.response.listen('This is a reprompt.')
        //if the card is made of two vars, then sth, else if 3 vars then title and image
            .cardRenderer(AlexaStrings.defaultCardStrings.de.GREETING_TEXT[0], AlexaStrings.defaultCardStrings.de.GREETING_TEXT[1]);
        this.emit(nodeEvents.RESPONSE_READY);
    },
    //TODO
    'SayPersonalAusweisInfo': function () {
        //var district = this.event.request.intent.slots.District.value;
        this.response.speak(Helper.getRandomResponseUtterance(AlexaStrings.defaultSpokenStrings.de.WIP_TEXT));
        this.response.speak(AlexaStrings.Dienstleistung_IntentSpokenStrings.de.PersoIntent);
        this.emit(nodeEvents.RESPONSE_READY)
    },


    //TODO
    'SayOpeningHours': function () {
        // var district = this.event.request.intent.slots.District.value;
        // this.response.speak('You are in ' + district);
        this.response.speak(Helper.getRandomResponseUtterance(AlexaStrings.defaultSpokenStrings.de.WIP_TEXT));
        this.response.speak('Allerdings kann ich dir sagen, dass ein Bürgeramt in der Nähe bestimmt auf hat');

        this.emit(nodeEvents.RESPONSE_READY)
    },



    'SayHelloName': function () {
        var name = this.event.request.intent.slots.name.value;
        this.response.speak('Hello ' + name)
            .cardRenderer('hello world', 'hello ' + name);
        this.emit(nodeEvents.RESPONSE_READY);
    },



    // Defaults + Housekeeping //
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak(AlexaStrings.defaultSpokenStrings.de.STOP_TEXT);
        this.emit(nodeEvents.RESPONSE_READY);
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak(AlexaStrings.defaultSpokenStrings.en.HELP_TEXT);

        this.emit(nodeEvents.RESPONSE_READY);
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('Bye');
        this.emit(nodeEvents.RESPONSE_READY);
    },
    'Unhandled' : function() {
        this.response.speak(AlexaStrings.defaultSpokenStrings.en.HELP_TEXT);
    }

};


//TODO Aufenthaltstitel example

var EN_US_handlers = {
    'HelloWorldIntent': function () {
        this.emit('SayHello');
    },
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak(AlexaStrings.defaultSpokenStrings.en.STOP_TEXT);
        this.emit(nodeEvents.RESPONSE_READY);
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak(AlexaStrings.defaultSpokenStrings.en.HELP_TEXT);
        // should not stop here, but continue listning
        this.emit(nodeEvents.RESPONSE_READY);
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak(AlexaStrings.defaultSpokenStrings.en.CANCEL_TEXT);
        this.emit(nodeEvents.RESPONSE_READY);
    },
    'Unhandled' : function() {
        this.response.speak(AlexaStrings.defaultSpokenStrings.en.HELP_TEXT);
    }

};

var FR_Handlers = {};











