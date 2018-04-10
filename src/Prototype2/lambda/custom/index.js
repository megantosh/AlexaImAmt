'use strict';
var Alexa = require("alexa-sdk");

// For detailed tutorial on how to making a Alexa skill,
// please visit us at http://alexa.design/build


exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers_de_DE, handlers_en_US);
    alexa.execute();
};

var handlers_en_US = {};

var handlers_de_DE = {
    'LaunchRequest': function () {
        this.emit('SayHello');
    },
    // 'HelloWorldIntent': function () {
    //     this.emit('SayHello');
    // },
    'MyNameIsIntent': function () {
        this.emit('SayHelloName');
    },
    'openingHoursIntent': function () {
        this.emit('SayOpeningHours')
    },


    ///////////////////////////////////////////////////////////////////////////////////////////////////

    'SayHello': function () {
        this.response.speak('Ich kann dir mit den zahlreichen Dienstleistungen der Stadt Berlin helfen! Was brauchst du genau?')
        //probably remove. Tacky here and takes away the idea of "voice app"
                     .cardRenderer('Willkommen beim virtuellen Service-Assistent der Stadt Berlin',
                         'Disclaimer: Beta-Version - This skill is in no way affiliated with Berlin.de website' +
                         ' - Alle Angaben ohne Gewähr');
        this.emit(':responseReady');
    },
    'SayOpeningHours': function () {
        var district = this.event.request.intent.slots.District.value;
        this.response.speak('You are in ' + district);
        this.emit(':responseReady')
    },



    'SayHelloName': function () {
        var name = this.event.request.intent.slots.name.value;
        this.response.speak('Hello ' + name)
            .cardRenderer('hello world', 'hello ' + name);
        this.emit(':responseReady');
    },



    ///////////////////////////////////////////////////////////////////////////////////////////////////

    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak("You can try: 'alexa, until when is Standesamt Friedrichshain-Kreuzberg open today'" +
            "or 'alexa, ask hello world my name is awesome Aaron'");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak("Sorry, I didn't get that. You can try: 'alexa, how do I transfer my driving license to a german one?'" +
            " or 'alexa, ask Berlin D. E. when is the nearest city hall open today.'");
    }
};
