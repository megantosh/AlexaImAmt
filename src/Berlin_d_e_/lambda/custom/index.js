// Author: Mohamed Megahed


'use strict'; //Optional, but allows vars etc for ES6



const Helper = require("./lib/helper.js");
const Speech = require("./lib/speeches.js");
const Card = require("./lib/cards.js");






//replace with respective Skill ID from dev console (OPTIONAL).
const APP_ID = 'amzn1.ask.skill.d7732837-fab2-42ff-a152-4eb0fc4ee646';

const Alexa = require("alexa-sdk");
const https = require("https");
const AWS = require("aws-sdk");
AWS.config.update({region: "eu-west-1"});


exports.handler = function(event, context, callback) {
    let alexa = Alexa.handler(event, context);
    // was changed from alexa.APP_ID in old API
    alexa.appId = APP_ID;

    alexa.resources = Speech.defaultSpokenStrings;


    var locale = event.request.locale;
    console.log(event)
    // registration for a multiligual skill - will define speech output based on locale
    // an extended alexa.registerHandlers(handlers, h1, h2); //you can register multiple handlers at once like here
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
    // TODO - so far Alexa doesn't store info and does not need persistence
    // (Here using Solr(HTTPS) only for GETs
    // if we want to make it learn, we should add a database such as Amazon DynamoDB
    // persistent session attributes to link:
    // alexa.dynamoDBTableName = "myTable";

    //to be understood like "Start skill after constructor completed"
    alexa.execute();
}

//the name we use to access this skill
//ber lin works better tan bär leen (has to consist of at least two words
// const invocationName = "bär leen";
const DE_handlers = {
    'AMAZON.CancelIntent': function () {
        this.response
            .speak('Tschüss');

        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {

        var CustomIntents = Helper.getCustomIntents();
        var MyIntent = Helper.randomphrase(CustomIntents);
        let say = 'Out of ' + CustomIntents.length + ' intents, here is one called, ' + MyIntent.name + ', just say, ' + MyIntent.samples[0];
        this.response
            .speak(say)
            .listen('try again, ' + say)
            .cardRenderer('Intent List', cardIntents(CustomIntents, Card.welcomeCardImg[0], Card.welcomeCardImg[1])); //iArray, welcomCardImg

        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {

        let say = 'Goodbye.';
        this.response
            .speak(say);

        this.emit(':responseReady');
    },
    'DL_ApprobationIntent': function () {
        // delegate to Alexa to collect all the required slots
        let isTestingWithSimulator = false; //autofill slots when using simulator, dialog management is only supported with a device
        let filledSlots = Helper.delegateSlotCollection.call(this, isTestingWithSimulator);

        if (!filledSlots) {
            return;
        }

        console.log("filled slots: " + JSON.stringify(filledSlots));
        // at this point, we know that all required slots are filled.
        let slotValues = Helper.getSlotValues(filledSlots);

        console.log(JSON.stringify(slotValues));


        let speechOutput = 'You have filled 2 required slots. ' +
            'BerufGesundheit resolved to,  ' + slotValues.BerufGesundheit.resolved + '. ' +
            'pruefungInBerlin resolved to,  ' + slotValues.pruefungInBerlin.resolved + '. ' ;

        console.log("Speech output: ", speechOutput);
        this.response.speak(speechOutput);
        this.emit(':responseReady');

        this.emit(':responseReady');
    },



    'DL_generalIntent': function () {
        // delegate to Alexa to collect all the required slots
        let isTestingWithSimulator = false; //autofill slots when using simulator, dialog management is only supported with a device
        let filledSlots = Helper.delegateSlotCollection.call(this, isTestingWithSimulator);

        if (!filledSlots) {
            return;
        }

        console.log("filled slots: " + JSON.stringify(filledSlots));
        // at this point, we know that all required slots are filled.
        let slotValues = Helper.getSlotValues(filledSlots);

        console.log(JSON.stringify(slotValues));


        let speechOutput = 'You have filled 3 required slots. ' +
            'Dienstleistung resolved to,  ' + slotValues.Dienstleistung.resolved + '. ' +
            'extension_flag resolved to,  ' + slotValues.extension_flag.resolved + '. ' +
            'prerequisites_flag resolved to,  ' + slotValues.prerequisites_flag.resolved + '. ' ;

        console.log("Speech output: ", speechOutput);
        this.response.speak(speechOutput);
        this.emit(':responseReady');

        this.emit(':responseReady');
    },
    'DL_AufenthaltstitelIntent': function () {
        // delegate to Alexa to collect all the required slots
        let isTestingWithSimulator = false; //autofill slots when using simulator, dialog management is only supported with a device
        let filledSlots = Helper.delegateSlotCollection.call(this, isTestingWithSimulator);

        if (!filledSlots) {
            return;
        }

        console.log("filled slots: " + JSON.stringify(filledSlots));
        // at this point, we know that all required slots are filled.
        let slotValues = Helper.getSlotValues(filledSlots);

        console.log(JSON.stringify(slotValues));


        let speechOutput = 'You have filled 5 required slots. ' +
            'registered_in_berlin resolved to,  ' + slotValues.registered_in_berlin.resolved + '. ' +
            'citizenship resolved to,  ' + slotValues.citizenship.resolved + '. ' +
            'residence_purpose resolved to,  ' + slotValues.residence_purpose.resolved + '. ' +
            'extension_flag resolved to,  ' + slotValues.extension_flag.resolved + '. ' +
            'prerequisites_flag resolved to,  ' + slotValues.prerequisites_flag.resolved + '. ' ;

        console.log("Speech output: ", speechOutput);
        this.response.speak(speechOutput);
        this.emit(':responseReady');

        this.emit(':responseReady');
    },
    'DL_BafoegIntent': function () {
        // delegate to Alexa to collect all the required slots
        let isTestingWithSimulator = false; //autofill slots when using simulator, dialog management is only supported with a device
        let filledSlots =  Helper.delegateSlotCollection.call(this, isTestingWithSimulator);

        if (!filledSlots) {
            return;
        }

        console.log("filled slots: " + JSON.stringify(filledSlots));
        // at this point, we know that all required slots are filled.
        let slotValues =  Helper.getSlotValues(filledSlots);

        console.log(JSON.stringify(slotValues));


        let speechOutput = 'You have filled 2 required slots. ' +
            'bafoegType resolved to,  ' + slotValues.bafoegType.resolved + '. ' +
            'prerequisites_flag resolved to,  ' + slotValues.prerequisites_flag.resolved + '. ' ;

        console.log("Speech output: ", speechOutput);
        this.response.speak(speechOutput);
        this.emit(':responseReady');

        this.emit(':responseReady');
    },
    'LOC_Intent': function () {
        let say = 'Hello from LOC_Intent. ';

        var slotStatus = '';
        var resolvedSlot;

        //   SLOT: office_type
        if (this.event.request.intent.slots.office_type.value) {
            const office_type = this.event.request.intent.slots.office_type;
            slotStatus += ' slot office_type was heard as ' + office_type.value + '. ';

            resolvedSlot =  Helper.resolveCanonical(office_type);

            if(resolvedSlot != office_type.value) {
                slotStatus += ' which resolved to ' + resolvedSlot;
            }
        } else {
            slotStatus += ' slot office_type is empty. ';
        }

        //   SLOT: office_name
        if (this.event.request.intent.slots.office_name.value) {
            const office_name = this.event.request.intent.slots.office_name;
            slotStatus += ' slot office_name was heard as ' + office_name.value + '. ';

            resolvedSlot =  Helper.resolveCanonical(office_name);

            if(resolvedSlot != office_name.value) {
                slotStatus += ' which resolved to ' + resolvedSlot;
            }
        } else {
            slotStatus += ' slot office_name is empty. ';
        }

        //   SLOT: district_single_name
        if (this.event.request.intent.slots.district_single_name.value) {
            const district_single_name = this.event.request.intent.slots.district_single_name;
            slotStatus += ' slot district_single_name was heard as ' + district_single_name.value + '. ';

            resolvedSlot =  Helper.resolveCanonical(district_single_name);

            if(resolvedSlot != district_single_name.value) {
                slotStatus += ' which resolved to ' + resolvedSlot;
            }
        } else {
            slotStatus += ' slot district_single_name is empty. ';
        }

        //   SLOT: district_combo_name
        if (this.event.request.intent.slots.district_combo_name.value) {
            const district_combo_name = this.event.request.intent.slots.district_combo_name;
            slotStatus += ' slot district_combo_name was heard as ' + district_combo_name.value + '. ';

            resolvedSlot =  Helper.resolveCanonical(district_combo_name);

            if(resolvedSlot != district_combo_name.value) {
                slotStatus += ' which resolved to ' + resolvedSlot;
            }
        } else {
            slotStatus += ' slot district_combo_name is empty. ';
        }


        say += slotStatus;

        this.response
            .speak(say)
            .listen('try again, ' + say)
            .cardRenderer('LOC_Intent', 'slot office_type is ' + office_type.value + '. slot office_name is ' + office_name.value + '. slot district_single_name is ' + district_single_name.value + '. slot district_combo_name is ' + district_combo_name.value + '. ');


        this.emit(':responseReady');
    },
    'ST_FutureTodos': function () {
        let say = 'Hello from ST_FutureTodos. ';

        var slotStatus = '';
        var resolvedSlot;

        //   SLOT: futureIntent
        if (this.event.request.intent.slots.futureIntent.value) {
            const futureIntent = this.event.request.intent.slots.futureIntent;
            slotStatus += ' slot futureIntent was heard as ' + futureIntent.value + '. ';

            resolvedSlot =  Helper.resolveCanonical(futureIntent);

            if(resolvedSlot != futureIntent.value) {
                slotStatus += ' which resolved to ' + resolvedSlot;
            }
        } else {
            slotStatus += ' slot futureIntent is empty. ';
        }

        //   SLOT: DogName
        if (this.event.request.intent.slots.DogName.value) {
            const DogName = this.event.request.intent.slots.DogName;
            slotStatus += ' slot DogName was heard as ' + DogName.value + '. ';

            resolvedSlot =  Helper.resolveCanonical(DogName);

            if(resolvedSlot != DogName.value) {
                slotStatus += ' which resolved to ' + resolvedSlot;
            }
        } else {
            slotStatus += ' slot DogName is empty. ';
        }


        say += slotStatus;

        this.response
            .speak(say)
            .listen('try again, ' + say)
            .cardRenderer('ST_FutureTodos', 'slot futureIntent is ' + futureIntent.value + '. slot DogName is ' + DogName.value + '. ');


        this.emit(':responseReady');
    },
    'ST_BerlinIntents': function () {
        let say = 'Hello from ST_BerlinIntents. ';

        this.response
            .speak(say)
            .listen('try again, ' + say)
            .cardRenderer('ST_BerlinIntents', '');


        this.emit(':responseReady');
    },
    //TODO: Make Alexa ask for help only the first few times
    'LaunchRequest': function () {
        let say =  Helper.randomphrase(
            [this.t('WELCOME1'),this.t('WELCOME2'),this.t('WELCOME3')] )  + ' ' + this.t('HELP');
        this.response
            .speak(say)
            .listen('try again, ' + say);

        this.emit(':responseReady');
    },
    'Unhandled': function () {
        let say = 'The skill did not quite understand what you wanted.  Do you want to try something else? ';
        this.response
            .speak(say)
            .listen(say);
    }};









// Skill logic in English (US) =======================================================================================
// const invocationName = "berlin service";
const EN_US_handlers = {
    'AMAZON.CancelIntent': function () {

        let say = 'Goodbye.';
        this.response
            .speak(say);

        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {

        var CustomIntents =  Helper.getCustomIntents();
        var MyIntent =  Helper.randomPhrase(CustomIntents);
        let say = 'Out of ' + CustomIntents.length + ' intents, here is one called, ' + MyIntent.name + ', just say, ' + MyIntent.samples[0];
        this.response
            .speak(say)
            .listen('try again, ' + say)
            .cardRenderer('Intent List',  Helper.cardIntents(CustomIntents)); // , welcomeCardImg

        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {

        let say = 'Goodbye.';
        this.response
            .speak(say);

        this.emit(':responseReady');
    },
    'DL_AufenthaltstitelIntent': function () {
        let say = 'Hello from DL_AufenthaltstitelIntent. ';

        this.response
            .speak(say)
            .listen('try again, ' + say)
            .cardRenderer('DL_AufenthaltstitelIntent', '');


        this.emit(':responseReady');
    },
    'BafoegIntent': function () {
        let say = 'Hello from BafoegIntent. ';

        this.response
            .speak(say)
            .listen('try again, ' + say)
            .cardRenderer('BafoegIntent', '');


        this.emit(':responseReady');
    },
    'ApprobationIntent': function () {
        let say = 'Hello from ApprobationIntent. ';

        this.response
            .speak(say)
            .listen('try again, ' + say)
            .cardRenderer('ApprobationIntent', '');


        this.emit(':responseReady');
    },
    'DL_generalIntent': function () {
        // delegate to Alexa to collect all the required slots
        let isTestingWithSimulator = false; //autofill slots when using simulator, dialog management is only supported with a device
        let filledSlots = Helper.delegateSlotCollection.call(this, isTestingWithSimulator);

        if (!filledSlots) {
            return;
        }

        console.log("filled slots: " + JSON.stringify(filledSlots));
        // at this point, we know that all required slots are filled.
        let slotValues = Helper.getSlotValues(filledSlots);

        console.log(JSON.stringify(slotValues));


        let speechOutput = 'You have filled 1 required slots. ' +
            'prerequisites resolved to,  ' + slotValues.prerequisites.resolved + '. ' ;

        console.log("Speech output: ", speechOutput);
        this.response.speak(speechOutput);
        this.emit(':responseReady');

        this.emit(':responseReady');
    },
    'ST_BerlinQuestions': function () {
        let say = 'Hello from ST_BerlinQuestions. ';

        this.response
            .speak(say)
            .listen('try again, ' + say)
            .cardRenderer('ST_BerlinQuestions', '');


        this.emit(':responseReady');
    },
    'ST_FutureTODOs': function () {
        let say = 'Hello from ST_FutureTODOs. ';

        var slotStatus = '';
        var resolvedSlot;

        //   SLOT: DogName
        if (this.event.request.intent.slots.DogName.value) {
            const DogName = this.event.request.intent.slots.DogName;
            slotStatus += ' slot DogName was heard as ' + DogName.value + '. ';

            resolvedSlot = Helper.resolveCanonical(DogName);

            if(resolvedSlot != DogName.value) {
                slotStatus += ' which resolved to ' + resolvedSlot;
            }
        } else {
            slotStatus += ' slot DogName is empty. ';
        }

        //   SLOT: futureIntent
        if (this.event.request.intent.slots.futureIntent.value) {
            const futureIntent = this.event.request.intent.slots.futureIntent;
            slotStatus += ' slot futureIntent was heard as ' + futureIntent.value + '. ';

            resolvedSlot = Helper.resolveCanonical(futureIntent);

            if(resolvedSlot != futureIntent.value) {
                slotStatus += ' which resolved to ' + resolvedSlot;
            }
        } else {
            slotStatus += ' slot futureIntent is empty. ';
        }


        say += slotStatus;

        this.response
            .speak(say)
            .listen('try again, ' + say)
            .cardRenderer('ST_FutureTODOs', 'slot DogName is ' + DogName.value + '. slot futureIntent is ' + futureIntent.value + '. ');


        this.emit(':responseReady');
    },
    'LaunchRequest': function () {
        let say = Helper.randomPhrase([this.t('WELCOME1'),this.t('WELCOME2'),this.t('WELCOME3')] )  + ' ' + this.t('HELP');
        this.response
            .speak(say)
            .listen('try again, ' + say);

        this.emit(':responseReady');
    },
    'Unhandled': function () {
        let say = 'The skill did not quite understand what you wanted.  Do you want to try something else? ';
        this.response
            .speak(say)
            .listen(say);
    }};


// ====== End of Skill ==============================================================================================









// End Skill Code
// Language Model  for reference
// var interactionModel = [
//     {
//         "name": "AMAZON.CancelIntent",
//         "samples": []
//     },
//     {
//         "name": "AMAZON.HelpIntent",
//         "samples": []
//     },
//     {
//         "name": "AMAZON.StopIntent",
//         "samples": []
//     },
//     {
//         "name": "DL_AufenthaltstitelIntent",
//         "slots": [],
//         "samples": []
//     },
//     {
//         "name": "BafoegIntent",
//         "slots": [],
//         "samples": []
//     },
//     {
//         "name": "ApprobationIntent",
//         "slots": [],
//         "samples": []
//     },
//     {
//         "name": "DL_generalIntent",
//         "slots": [
//             {
//                 "name": "Dienstleistung",
//                 "type": "EN_LIST_OF_PUBLIC_SVCS_BLN"
//             },
//             {
//                 "name": "prerequisites",
//                 "type": "EN_YES_NO_FLAG",
//                 "samples": [
//                     "{prerequisites} please"
//                 ]
//             }
//         ],
//         "samples": [
//             "how do i {Dienstleistung}",
//             "i want to {Dienstleistung}",
//             "i would like to {Dienstleistung}"
//         ]
//     },
//     {
//         "name": "ST_BerlinQuestions",
//         "slots": [],
//         "samples": []
//     },
//     {
//         "name": "ST_FutureTODOs",
//         "slots": [
//             {
//                 "name": "DogName",
//                 "type": "AMAZON.US_FIRST_NAME"
//             },
//             {
//                 "name": "futureIntent",
//                 "type": "Todo_List"
//             }
//         ],
//         "samples": [
//             "I need an apartment",
//             "where can I {futureIntent}",
//             "I want to go bathing",
//             "I need a house",
//             "I lost my Meldebscheinigung",
//             "where do I find {DogName}",
//             "where did my dog go",
//             "where do I find my lost dog",
//             "how can I find my dog",
//             "I lost my dog",
//             "ich habe ein Kind bekommen wo kann ich eine geburtsurkunde beantragen"
//         ]
//     },
//     {
//         "name": "LaunchRequest"
//     }
// ];
// var intentsReference = [
//     {
//         "name": "AMAZON.CancelIntent",
//         "samples": []
//     },
//     {
//         "name": "AMAZON.HelpIntent",
//         "samples": []
//     },
//     {
//         "name": "AMAZON.StopIntent",
//         "samples": []
//     },
//     {
//         "name": "DL_AufenthaltstitelIntent",
//         "slots": [],
//         "samples": []
//     },
//     {
//         "name": "BafoegIntent",
//         "slots": [],
//         "samples": []
//     },
//     {
//         "name": "ApprobationIntent",
//         "slots": [],
//         "samples": []
//     },
//     {
//         "name": "DL_generalIntent",
//         "slots": [
//             {
//                 "name": "Dienstleistung",
//                 "type": "EN_LIST_OF_PUBLIC_SVCS_BLN"
//             },
//             {
//                 "name": "prerequisites",
//                 "type": "EN_YES_NO_FLAG",
//                 "samples": [
//                     "{prerequisites} please"
//                 ]
//             }
//         ],
//         "samples": [
//             "how do i {Dienstleistung}",
//             "i want to {Dienstleistung}",
//             "i would like to {Dienstleistung}"
//         ]
//     },
//     {
//         "name": "ST_BerlinQuestions",
//         "slots": [],
//         "samples": []
//     },
//     {
//         "name": "ST_FutureTODOs",
//         "slots": [
//             {
//                 "name": "DogName",
//                 "type": "AMAZON.US_FIRST_NAME"
//             },
//             {
//                 "name": "futureIntent",
//                 "type": "Todo_List"
//             }
//         ],
//         "samples": [
//             "I need an apartment",
//             "where can I {futureIntent}",
//             "I want to go bathing",
//             "I need a house",
//             "I lost my Meldebscheinigung",
//             "where do I find {DogName}",
//             "where did my dog go",
//             "where do I find my lost dog",
//             "how can I find my dog",
//             "I lost my dog",
//             "ich habe ein Kind bekommen wo kann ich eine geburtsurkunde beantragen"
//         ]
//     },
//     {
//         "name": "LaunchRequest"
//     }
// ];
//














// /* eslint-disable  func-names */
// /* eslint quote-props: ["error", "consistent"]*/
// /**
//  * This sample demonstrates a simple skill built with the Amazon Alexa Skills
//  * nodejs skill development kit.
//  * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
//  * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
//  * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
//  **/

// 'use strict';
// const Alexa = require('alexa-sdk');

// //=========================================================================================================================================
// //TODO: The items below this comment need your attention.
// //=========================================================================================================================================

// //Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
// //Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
// const APP_ID = undefined;

// const SKILL_NAME = 'Space Facts';
// const GET_FACT_MESSAGE = "Here's your fact: ";
// const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
// const HELP_REPROMPT = 'What can I help you with?';
// const STOP_MESSAGE = 'Goodbye!';

// //=========================================================================================================================================
// //TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/data
// //=========================================================================================================================================
// const data = [
//     'A year on Mercury is just 88 days long.',
//     'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
//     'Venus rotates counter-clockwise, possibly because of a collision in the past with an asteroid.',
//     'On Mars, the Sun appears about half the size as it does on Earth.',
//     'Earth is the only planet not named after a god.',
//     'Jupiter has the shortest day of all the planets.',
//     'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
//     'The Sun contains 99.86% of the mass in the Solar System.',
//     'The Sun is an almost perfect sphere.',
//     'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
//     'Saturn radiates two and a half times more energy into space than it receives from the sun.',
//     'The temperature inside the Sun can reach 15 million degrees Celsius.',
//     'The Moon is moving approximately 3.8 cm away from our planet every year.',
// ];

// //=========================================================================================================================================
// //Editing anything below this line might break your skill.
// //=========================================================================================================================================

// const handlers = {
//     'LaunchRequest': function () {
//         this.emit('GetNewFactIntent');
//     },
//     'GetNewFactIntent': function () {
//         const factArr = data;
//         const factIndex = Math.floor(Math.random() * factArr.length);
//         const randomFact = factArr[factIndex];
//         const speechOutput = GET_FACT_MESSAGE + randomFact;

//         this.response.cardRenderer(SKILL_NAME, randomFact);
//         this.response.speak(speechOutput);
//         this.emit(':responseReady');
//     },
//     'AMAZON.HelpIntent': function () {
//         const speechOutput = HELP_MESSAGE;
//         const reprompt = HELP_REPROMPT;

//         this.response.speak(speechOutput).listen(reprompt);
//         this.emit(':responseReady');
//     },
//     'AMAZON.CancelIntent': function () {
//         this.response.speak(STOP_MESSAGE);
//         this.emit(':responseReady');
//     },
//     'AMAZON.StopIntent': function () {
//         this.response.speak(STOP_MESSAGE);
//         this.emit(':responseReady');
//     },
// };

// exports.handler = function (event, context, callback) {
//     const alexa = Alexa.handler(event, context, callback);
//     alexa.APP_ID = APP_ID;
//     alexa.registerHandlers(handlers);
//     alexa.execute();
// };