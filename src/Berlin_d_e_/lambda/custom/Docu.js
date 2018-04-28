// Emittable Node Events for Alexa
// Compiled by: Mohamed Megahed




// ==== Node events =====================================
//https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs/blob/master/Readme.md
exports.nodeEvents = {

    //Called after the response is built but before it is returned to the Alexa service. Calls :saveState.
    RESPONSE_READY : ':responseReady',


    DELEGATE : ':delegate',


    //old ones

    //this.emit(':tell', speechOutput);
    TELL : ':tell',

    //
    //use:
    //this.emit(':ask', speechOutput, repromptSpeech);
    ASK : ':ask',

    SPEAK : ':speak',

    //this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);
    ASK_WITH_CARD : ':askWithCard',

    //this.emit(':tellWithCard', speechOutput, cardTitle, cardContent, imageObj);
    TELL_WITH_CARD : ':tellWithCard',


    TELL_WITH_ACCT_CARD :'tellWithLinkAccountCard',
    ASK_WITH_ACCT_CARD: ':askWithLinkAccountCard',



    //this.emit(':saveState', false); // Handles saving the contents of this.attributes and the current handler state to DynamoDB and then sends the previously built response to the Alexa service. Override if you wish to use a different persistence provider. The second attribute is optional and can be set to ‘true’ to force saving.
    SAVE_STATE : ':saveState',

    // Called if there is an error while saving state. Override to handle any errors yourself.
    //this.emit(':saveStateError');




// ASK_FOR_PERMISSIONS_CONSENT:
}





//  ==== Code Patterns ===============================================================================================

// format:
// this.emit(:${action}, 'responseContent').
// {
//     //event, answer
//     this.emit(':tell', 'Hello World!');
//     //event, prompt, reprompt
//     this.emit(':ask', 'What would you like to do?', 'Please say that again?');
// }
// {
//     this.response.speak('Hello World!');
//     this.emit(':responseReady');
//
//     this.response.speak('What would you like to do?')
//         .listen('Please say that again?');
//     this.emit(':responseReady');
// }
