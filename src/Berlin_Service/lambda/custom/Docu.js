// Emittable Node Events for Alexa
// Compiled by: Mohamed Megahed




// ==== Node events / based on ASK GitHub repo =====================================

//  More info on: https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs/blob/master/Readme.md

// Speech outputs

// Tell with speechOutput
this.emit(':tell',speechOutput);
// Ask with speechOutput and repromptSpeech
this.emit(':ask', speechOutput, repromptSpeech);
// Tell with speechOutput and standard card
this.emit(':tellWithCard', speechOutput, cardTitle, cardContent, imageObj);
// Ask with speechOutput, repromptSpeech and standard card
this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);
// Tell with linkAccount card, for more information, visit the github url above
this.emit(':tellWithLinkAccountCard', speechOutput);
// Ask with linkAccount card, for more information, visit the github url above
this.emit(':askWithLinkAccountCard', speechOutput);
// Tell with permission card, for more information, visit the github url above
this.emit(':tellWithPermissionCard', speechOutput, permissionArray);
// Ask with permission card, for more information, visit the github url above
this.emit(':askWithPermissionCard', speechOutput, repromptSpeech, permissionArray)
// Response with delegate directive in dialog model
this.emit(':delegate', updatedIntent);
// Response with elicitSlot directive in dialog model
this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech, updatedIntent);
// Response with card and elicitSlot directive in dialog model
this.emit(':elicitSlotWithCard', slotToElicit, speechOutput, repromptSpeech, cardTitle, cardContent, updatedIntent, imageObj);
// Response with confirmSlot directive in dialog model
this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech, updatedIntent);
//Response with card and confirmSlot directive in dialog model
this.emit(':confirmSlotWithCard', slotToConfirm, speechOutput, repromptSpeech, cardTitle, cardContent, updatedIntent, imageObj);
// Response with confirmIntent directive in dialog model
this.emit(':confirmIntent', speechOutput, repromptSpeech, updatedIntent);
// Reponse with card and confirmIntent directive in dialog model
this.emit(':confirmIntentWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, updatedIntent, imageObj);
// Called after the response is built but before it is returned to the Alexa service. Calls : saveState. Can be overridden.
this.emit(':responseReady');
// Handles saving the contents of this.attributes and the current handler state to DynamoDB and then sends the
// previously built response to the Alexa service. Override if you wish to use a different persistence provider.
// The second attribute is optional and can be set to 'true' to force saving.
this.emit(':saveState', false);
// Called if there is an error while saving state. Override to handle any errors yourself.
this.emit(':saveStateError');



//speech inputs

// Set the first speech output to speechOutput
this.response.speak(speechOutput);
// Set the reprompt speech output to repromptSpeech, shouldEndSession to false. Unless this function is called, this.response will set shouldEndSession to true.
this.response.listen(repromptSpeech);
// Add a standard card with cardTitle, cardContent and cardImage in response
this.response.cardRenderer(cardTitle, cardContent, cardImage);
// Add a linkAccount card in response, for more information, click here
this.response.linkAccountCard();
// Add a card to ask for permission in response, for more information, click here
this.response.askForPermissionsConsentCard(permissions);
// (Deprecated) 	Add an AudioPlayer directive with provided parameters in response.
this.response.audioPlayer(directiveType, behavior, url, token, expectedPreviousToken, offsetInMilliseconds);
// Add an AudioPlayer directive using the provided parameters, and set AudioPlayer.Play as the directive type.
this.response.audioPlayerPlay(behavior, url, token, expectedPreviousToken, offsetInMilliseconds);
// Add an AudioPlayer.Stop directive
this.response.audioPlayerStop();
// Add an AudioPlayer.ClearQueue directive and set the clear
this.response.audioPlayerClearQueue(clearBehavior);
// behaviour of the directive.
// Add a Display.RenderTemplate directive in response
this.response.renderTemplate(template);
// Add a Hint directive in response
this.response.hint(hintText, hintType);
// Add a VideoApp.Play directive in response
this.response.playVideo(videoSource, metadata);
// Set shouldEndSession manually
this.response.shouldEndSession(bool);


//frequently used ones:
exports.nodeEvents = {
    RESPONSE_READY : ':responseReady',
    DELEGATE : ':delegate',
    TELL : ':tell',
    ASK : ':ask',
    SPEAK : ':speak',
    ASK_WITH_CARD : ':askWithCard',
    TELL_WITH_CARD : ':tellWithCard',
    TELL_WITH_ACCT_CARD :'tellWithLinkAccountCard',
    ASK_WITH_ACCT_CARD: ':askWithLinkAccountCard',
    SAVE_STATE : ':saveState',
    SAVE_STATE_ERR: ':saveStateError'}




//
// intent.slots[].value – this is the same value your skill would be receiving today, which reflects the value the user spoke.
//
//     intent.slots[].resolution.resolutionsPerAuthority.values[].value.id – this is the unique identifier you assigned to your slot value.
//
//     intent.slots[].resolutions.resolutionsPerAuthority.values[].value.name – this is the actual slot value that you defined.
//
//     intent.slots[].resolutions.resolutionsPerAuthority.authority – this is the slot type that was used.

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








this . event . request . intent . slots . mySlot . value
