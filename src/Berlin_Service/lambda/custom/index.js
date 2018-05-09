// Author: Mohamed Megahed

// recommendation for a skill development: Start by building the interaction model
// then you can generate a Blueprint for generic Code
// to start with from your model on https://alexa.design/skillcode
// then handle the fulfilment inside each intent match

// reprompts + cards best tested with a real Alexa-enabled device with screen!
// More on available node events in Docu.js


//Optional, vars etc for ES6
//Amazon stopped using it since Q1-2018
'use strict';

const Helper = require("./lib/helper.js");
const Speech = require("./lib/speeches.js");
const Card = require("./lib/cards.js");

const de_DE_model = require('./lib/modelDuplicates/de-DE.json');
const en_US_model = require('./lib/modelDuplicates/en-US.json');

const http = require('http');
const https = require('https');
const url = require("url");
const Alexa = require("alexa-sdk");
const AWS = require("aws-sdk");
const util = require('util');

// the name we call the skill with by saying "Alexa, (open|ask|tell|...) <invocationName>
// has to consist of at least two words, small letters - read guidelines
// Some suggestions and old names we use to access this skill: Berlin info, bär leen, ber lynn, la mairie de berlin
// ber lin works better tan bär leen
const invocationName = "berlin service";
//replace with respective Skill ID from dev console (OPTIONAL).
const APP_ID = 'amzn1.ask.skill.d7732837-fab2-42ff-a152-4eb0fc4ee646';
//force use Ireland Server (at the time of dev, this was the closes
AWS.config.update({region: "eu-west-1"});


// a handler acts like an initializer to Alexa
// event: Input event (get one from a JSON via ASK simulator
// context: Lambda's context
// check ../../Test in project structure for mock events and contexts
exports.handler = function (event, context, callback) {
    let alexa = Alexa.handler(event, context);
    // was changed from alexa.APP_ID in old ASK/AWS API
    alexa.appId = APP_ID; //

    // we will not use 'alexa.resources' to depend on the language translations, since
    // our intents differ between the english and german model. We use Speeches.js instead
    // Amazon Dev Blog: "
    // we use [e.g] this.t(“STOP_MESSAGE”) which instructs the SDK to provide the STOP_MESSAGE
    // property associated with the appropriate language. Here the SDK is calling a function that identifies the
    // locale object in your skills request and then returns the appropriate variable from your earlier defined resources object.
    // " https://developer.amazon.com/blogs/post/Tx1JIHCCFK3SDBI/alexa-skills-kit-sdk-and-sample-skill-templates-add-support-for-multiple-languages
    // If you ever want to change this in the future, uncomment line below and languageStrings.
    // alexa.resources = languageStrings;

    let currLocale = event.request.locale;
    console.log(event)
    // registration for a multiligual skill - will define speech output based on locale
    // an extended alexa.registerHandlers(handlers, h1, h2); //you can register multiple handlers at once like here
    if (currLocale == 'de-DE') {
        alexa.registerHandlers(DE_handlers);
        console.log('registered german handler');
    } else if (currLocale == 'fr-FR') {
        alexa.registerHandlers(FR_handlers);
        console.log('registered french handler');
    } else { //basically if currLocale.startsWith('en')
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
};


//what Alexa will do if we get into any of the keys found in de_DE.json
//german interaction model
const DE_handlers = {

    //Entry point: triggered when user says open Berlin Service (or other skill name)
    'LaunchRequest': function () {
        // try this line in combination with alexa.resources (notice the this.t(...))
        // let say = randomPhrase([this.t('WELCOME1'), this.t('WELCOME2'), this.t('WELCOME3')]) + ' ' + this.t('HELP');

        let introAudio = " OK " +
            // "<audio src='https://s3.eu-central-1.amazonaws.com/megantosh/RegioSound-48kbps.mp3' /> " +
            //" <audio src='https://s3.amazonaws.com/my-ssml-samples/Flourish.mp3' /> " +
            "<audio src='https://s3.amazonaws.com/ask-soundlibrary/office/amzn_sfx_typing_medium_02.mp3'/>";

        // alternatively, using the line below to avoid reprompts. (ResponseBuilder: remove . concat)
        // this.emit(':ask', introAudio, Speech.de.HELP_TEXT)
        this.response
            .speak(introAudio + Helper.randomphrase(Speech.de.INTRO_GREETING_TEXT))
            // this.emit(('AMAZON.HelpIntent'));
            // alternatively, if you don't want to use the HelpIntent, if it's too verbose for you
            .listen('Hmm.. ' + Helper.randomphrase(Speech.de.INTRO_HELP_TEXT) + '<p> Wenn Sie Unterstützung brauchen,' +
                " sagen Sie </p>  <prosody pitch=\"medium\"> " +
                Helper.randomphrase(de_DE_model.interactionModel.languageModel.intents[1].samples) +
                " </prosody> ");
        // this.emit(('AMAZON.HelpIntent'));
        this.emit(':responseReady');

        console.log("exited LaunchRquest");
    },

    //TODO doc
    'Unhandled': function () {

        this.attributes.speechOutput = Speech.de.INTRO_UNHANDLED_TEXT[0] // this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = Speech.de.INTRO_UNHANDLED_TEXT[1]//this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);

        // this.response
        //     .speak(Helper.randomphrase(Speech.de.INTRO_UNHANDLED_TEXT[0]))
        //     .listen(Helper.randomphrase(Speech.de.INTRO_UNHANDLED_TEXT[0]));
        // this.emit(':responseReady');
        console.log("exited unhandledRequest");

    },

    // The CancelIntent is meant here to take you one step back in the menu more or less (Frame design)
    'AMAZON.CancelIntent': function () {

        let index = Math.floor(Math.random() * Speech.de.INTRO_CANCEL_TEXT_START.length);
        this.response
            .speak(Speech.de.INTRO_CANCEL_TEXT_START[index])
            .listen(Speech.de.INTRO_CANCEL_TEXT_END[index]);
        this.emit(':responseReady');
        console.log("exited cancelIntent");

    },


    //a guide through the Skill. Tells you what sentences you can possibly say.
    //invoke by saying 'Hilfe'
    'AMAZON.HelpIntent': function () {


        let CustomIntents = Helper.getCustomIntents('de_DE');
        let MyIntent = Helper.randomphrase(CustomIntents);
        // let MyIntent = CustomIntents[9];
        // console.log("keys of Intent: " + Object.keys(MyIntent))
        console.log("Inspection : " + util.inspect(MyIntent));


        let MyIntentRandomSampleIndex = Math.floor(Math.random() * MyIntent.samples.length);
        let MyReadableIntent = Helper.extractHumanReadableIntent(MyIntent.name);
        let MyReadableSample = Helper.extractHumanReadableSample(MyIntent.samples[MyIntentRandomSampleIndex], 'de_de');

        let cardTemplate = Helper.cardIntents(CustomIntents, 'de_DE');

        try {
            let say = "<p> Von den " +
                CustomIntents.length + //TODO replace with "mehreren". User couldn't care less how much we offer,
                ' Themengruppen, die ich kenne, ' +
                "kann ich Ihnen diesen vorschlagen </p>" + MyReadableIntent
                //     + " . Versuchen Sie mal " +
                //     "<emphasis level='moderate'> " +
                //     MyReadableSample
                // " </emphasis> ";
            ;
            let reprompt = "Versuchen Sie nochmal. Zum Beispiel : " + Helper.extractHumanReadableSample(MyIntent.samples[0], 'de_DE');

            this.response
                .speak(say)
                .listen(reprompt)
                .cardRenderer('Themengruppen', cardTemplate, Card.logo);  //remove card if too big

            this.emit(':responseReady');
            console.log('MyIntentRandomSampleIndex contains: \'' + MyIntentRandomSampleIndex + '\' of type: ' + typeof MyIntentRandomSampleIndex);
            console.log('MyReadableIntent contains: \'' + MyReadableIntent + '\' of type: ' + typeof MyReadableIntent);
            console.log('MyReadableSample contains: ' + MyReadableSample + ' of type: ' + typeof MyReadableSample);

            console.log("exited helpIntent");
        } catch (err) {
            console.error('some HelpIntent ERR: ' + err.message);
        }

    },

    // The StopIntent is meant here to take you out of the skill as an Interrupt and exit gracefully
    'AMAZON.StopIntent': function () {

        let say = Helper.randomphrase(Speech.de.INTRO_STOP_TEXT);
        this.response
            .speak(say);

        this.emit(':responseReady');
        console.log("exited stopIntent");

    },


    //This is the main intent our skill revolves around
    //To se what public services it handles, check "DE_PublicSvcs_Berlin" in interaction model
    'DL_General_Intent_Allgemeine_Fragen': function () {
        // delegate to Alexa to collect all the required slots
        // here a confirmation of the service name

        //autofill slots when using simulator, dialog management is only supportedwith a device
        let isTestingWithSimulator = false;
        let filledSlots = Helper.delegateSlotCollection.call(this, isTestingWithSimulator);

        if (!filledSlots) {
            return;
        }

        console.log("filled slots: " + JSON.stringify(filledSlots));
        // at this point, we know that all required slots are filled.
        let slotValues = Helper.getSlotValues(filledSlots);

        console.log('slot values: ' + JSON.stringify(slotValues));

        // e.g. "select?q=personalausweis&wt=json&indent=true"
        let solrquery = slotValues.Dienstleistung.resolved.replace(/ /g, '+');
        let endpointOptions = "select?q=" + solrquery + "&wt=json&indent=true";
        let docIndex = 0;
        let say = '';


//TODO you want to change the parameter to what it has been resolved

        // if(slotValues.Dienstleistung.resolved == 'Personalausweis beantragen'){
        console.log('understood for solr: ' + slotValues.Dienstleistung.resolved);

        Helper.httpsGet(Helper.buildHttpGetOptions(endpointOptions))
            .then(
                response => {
                    console.log(" RESULTS: ", JSON.stringify(response));

                    let pubSvcName = JSON.stringify(response.response.docs[docIndex].d115Name);
                    console.log('pubSvcName: ' + pubSvcName);
                    let pubSvcInfo = JSON.stringify(response.response.docs[docIndex].d115Description);
                    console.log('pubSvcInfo: ' + pubSvcInfo);
                    let pubSvcPrereq = JSON.stringify(response.response.docs[docIndex].d115Prerequisites);
                    console.log('pubSvcPrereq: ' + pubSvcPrereq);
                    let pubSvcCost = JSON.stringify(response.response.docs[docIndex].d115Fees);
                    console.log('pubSvcCost: ' + pubSvcCost);
                    let pubSvcProcessTime = JSON.stringify(response.response.docs[docIndex].d115ProcessTime);
                    console.log('pubSvcProcessTime: ' + pubSvcProcessTime);
                    let pubSvcReqDocs = JSON.stringify(response.response.docs[docIndex].d115Requirements);
                    console.log('pubSvcReqDocs: ' + pubSvcReqDocs);

                    //cleaning the string from API here
                    pubSvcInfo = Helper.reformatHTMLtoAlexaFriendly(pubSvcInfo);
                    pubSvcPrereq = Helper.reformatHTMLtoAlexaFriendly(pubSvcPrereq);
                    pubSvcCost = Helper.reformatHTMLtoAlexaFriendly(pubSvcCost);
                    pubSvcProcessTime = Helper.reformatHTMLtoAlexaFriendly(pubSvcProcessTime);
                    pubSvcReqDocs = Helper.reformatHTMLtoAlexaFriendly(pubSvcReqDocs);

                    console.log('after cleaning: ' + pubSvcInfo);
                    console.log('after cleaning: ' + pubSvcPrereq);
                    console.log('after cleaning: ' + pubSvcCost);
                    console.log('after cleaning: ' + pubSvcProcessTime);
                    console.log('after cleaning: ' + pubSvcReqDocs);

                    //do not use now lest u break the ssml because of a </p>
                    // pubSvcInfo = pubSvcInfo.substr(0,400);


                    if (response.response.numFound > 0) {
                        //This is an AllInclusive :-) for testing
                        this.response.speak('Dienstname: ' + pubSvcName + '. Beschreibung: ' + pubSvcInfo + '. Kosten: ' +
                            pubSvcCost + '. Voraussetzungen: ' + pubSvcPrereq + ". Bearbeitungsdauer: " + pubSvcProcessTime +
                            '. Unterlagen: ' + pubSvcReqDocs);

                        //TODO check for each of the 5 slots - ask the user, then return the results if
                        // they want (i.e. if it is validated and resolves to ja
                        if(slotValues.required_docs_flag.isValidated == true && slotValues.required_doc_flag.resolved =='ja'){
                           this.response.listen(say)//todoetc
                               .cardRenderer(pubSvcName, Helper.reformatJSONtoAlexaFriendly(pubSvcInfo));

                        }




                        // 'Dienstleistung resolved to,  ' + slotValues.Dienstleistung.resolved + '. ' +
                        // 'prerequisites_flag resolved to,  ' + slotValues.prerequisites_flag.resolved + '. ';


                    } else {
                        this.response.speak('Dafür liefert mir Solr Null ergebnisse');
                    }

                    console.log("response: ", response);

                }
            ).catch(error => {
            console.log(error);
            this.response.speak("Tut mir Leid. Solr hat grad Feierabend. ");

        }).then(() => {
                // after we get a result, have Alexa speak.
                this.emit(':responseReady');
            }
        );
        // }
    },



    'DL_Costs_Intent_Was_kostet_eine_Dienstleistung': function () {
        // delegate to Alexa to collect all the required slots
        // here a confirmation of the service name

        //autofill slots when using simulator, dialog management is only supportedwith a device
        let isTestingWithSimulator = false;
        let filledSlots = Helper.delegateSlotCollection.call(this, isTestingWithSimulator);

        if (!filledSlots) {
            return;
        }

        console.log("filled slots: " + JSON.stringify(filledSlots));
        // at this point, we know that all required slots are filled.
        let slotValues = Helper.getSlotValues(filledSlots);

        console.log('slot values: ' + JSON.stringify(slotValues));

        // e.g. "select?q=personalausweis&wt=json&indent=true"
        let solrquery = slotValues.Dienstleistung.resolved.replace(/ /g, '+');
        let endpointOptions = "select?q=" + solrquery + "&wt=json&indent=true";
        let docIndex = 0;
        let say = '';


//TODO you want to change the parameter to what it has been resolved

        // if(slotValues.Dienstleistung.resolved == 'Personalausweis beantragen'){
        console.log('understood for solr: ' + slotValues.Dienstleistung.resolved);

        Helper.httpsGet(Helper.buildHttpGetOptions(endpointOptions))
            .then(
                response => {
                    console.log(" RESULTS: ", JSON.stringify(response));

                    let pubSvcName = JSON.stringify(response.response.docs[docIndex].d115Name);
                    console.log('pubSvcName: ' + pubSvcName);
                    // let pubSvcInfo = JSON.stringify(response.response.docs[docIndex].d115Description);
                    // console.log('pubSvcInfo: ' + pubSvcInfo);
                    // let pubSvcPrereq = JSON.stringify(response.response.docs[docIndex].d115Prerequisites);
                    // console.log('pubSvcPrereq: ' + pubSvcPrereq);
                    let pubSvcCost = JSON.stringify(response.response.docs[docIndex].d115Fees);
                    console.log('pubSvcCost: ' + pubSvcCost);
                    // let pubSvcProcessTime = JSON.stringify(response.response.docs[docIndex].d115ProcessTime);
                    // console.log('pubSvcProcessTime: ' + pubSvcProcessTime);
                    // let pubSvcReqDocs = JSON.stringify(response.response.docs[docIndex].d115Requirements);
                    // console.log('pubSvcReqDocs: ' + pubSvcReqDocs);

                    //cleaning the string from API here
                    // pubSvcInfo = Helper.reformatHTMLtoAlexaFriendly(pubSvcInfo);
                    // pubSvcPrereq = Helper.reformatHTMLtoAlexaFriendly(pubSvcPrereq);
                    pubSvcCost = Helper.reformatHTMLtoAlexaFriendly(pubSvcCost);
                    // pubSvcProcessTime = Helper.reformatHTMLtoAlexaFriendly(pubSvcProcessTime);
                    // pubSvcReqDocs = Helper.reformatHTMLtoAlexaFriendly(pubSvcReqDocs);

                    // console.log('after cleaning: ' + pubSvcInfo);
                    // console.log('after cleaning: ' + pubSvcPrereq);
                    console.log('after cleaning: ' + pubSvcCost);
                    // console.log('after cleaning: ' + pubSvcProcessTime);
                    // console.log('after cleaning: ' + pubSvcReqDocs);

                    //do not use now lest u break the ssml because of a </p>
                    // pubSvcInfo = pubSvcInfo.substr(0,400);


                    if (response.response.numFound > 0) {
                        //This is an AllInclusive :-) for testing
                        this.response.speak("<p> Ich finde: " + pubSvcName + "</p> Die Kosten dafür sind: " + pubSvcCost
                        + '<p> Wenn Sie weitere Fragen zu den nötigen Unterlagen haben, sage ich Ihnen gerne was dazu</p>');

                        //TODO check for each of the 5 slots - ask the user, then return the results if
                        // they want (i.e. if it is validated and resolves to ja
                        if(slotValues.costs_flag.isValidated == true && slotValues.costs_flag.resolved =='ja'){
                            this.response.listen(say)//todoetc
                                .cardRenderer(pubSvcName, Helper.reformatJSONtoAlexaFriendly(pubSvcCost));

                        }




                        // 'Dienstleistung resolved to,  ' + slotValues.Dienstleistung.resolved + '. ' +
                        // 'prerequisites_flag resolved to,  ' + slotValues.prerequisites_flag.resolved + '. ';


                    } else {
                        this.response.speak('Dafür liefert mir Solr Null ergebnisse');
                    }

                    console.log("response: ", response);

                }
            ).catch(error => {
            console.log(error);
            this.response.speak("Tut mir Leid. Solr hat grad Feierabend. ");

        }).then(() => {
                // after we get a result, have Alexa speak.
                this.emit(':responseReady');
            }
        );
        // }
    },







    'DL_Prereq_Intent_Was_muss_ich_erfuellen_fuer_die_Dienstleistung': function () {
        // delegate to Alexa to collect all the required slots
        // here a confirmation of the service name

        //autofill slots when using simulator, dialog management is only supportedwith a device
        let isTestingWithSimulator = false;
        let filledSlots = Helper.delegateSlotCollection.call(this, isTestingWithSimulator);

        if (!filledSlots) {
            return;
        }

        console.log("filled slots: " + JSON.stringify(filledSlots));
        // at this point, we know that all required slots are filled.
        let slotValues = Helper.getSlotValues(filledSlots);

        console.log('slot values: ' + JSON.stringify(slotValues));

        // e.g. "select?q=personalausweis&wt=json&indent=true"
        let solrquery = slotValues.Dienstleistung.resolved.replace(/ /g, '+');
        let endpointOptions = "select?q=" + solrquery + "&wt=json&indent=true";
        let docIndex = 0;
        let say = '';


//TODO you want to change the parameter to what it has been resolved

        // if(slotValues.Dienstleistung.resolved == 'Personalausweis beantragen'){
        console.log('understood for solr: ' + slotValues.Dienstleistung.resolved);

        Helper.httpsGet(Helper.buildHttpGetOptions(endpointOptions))
            .then(
                response => {
                    console.log(" RESULTS: ", JSON.stringify(response));

                    let pubSvcName = JSON.stringify(response.response.docs[docIndex].d115Name);
                    console.log('pubSvcName: ' + pubSvcName);
                    // let pubSvcInfo = JSON.stringify(response.response.docs[docIndex].d115Description);
                    // console.log('pubSvcInfo: ' + pubSvcInfo);
                    let pubSvcPrereq = JSON.stringify(response.response.docs[docIndex].d115Prerequisites);
                    console.log('pubSvcPrereq: ' + pubSvcPrereq);
                    // let pubSvcCost = JSON.stringify(response.response.docs[docIndex].d115Fees);
                    // console.log('pubSvcCost: ' + pubSvcCost);
                    // let pubSvcProcessTime = JSON.stringify(response.response.docs[docIndex].d115ProcessTime);
                    // console.log('pubSvcProcessTime: ' + pubSvcProcessTime);
                    // let pubSvcReqDocs = JSON.stringify(response.response.docs[docIndex].d115Requirements);
                    // console.log('pubSvcReqDocs: ' + pubSvcReqDocs);

                    //cleaning the string from API here
                    // pubSvcInfo = Helper.reformatHTMLtoAlexaFriendly(pubSvcInfo);
                    pubSvcPrereq = Helper.reformatHTMLtoAlexaFriendly(pubSvcPrereq);
                    // pubSvcCost = Helper.reformatHTMLtoAlexaFriendly(pubSvcCost);
                    // pubSvcProcessTime = Helper.reformatHTMLtoAlexaFriendly(pubSvcProcessTime);
                    // pubSvcReqDocs = Helper.reformatHTMLtoAlexaFriendly(pubSvcReqDocs);

                    // console.log('after cleaning: ' + pubSvcInfo);
                    console.log('after cleaning: ' + pubSvcPrereq);
                    // console.log('after cleaning: ' + pubSvcCost);
                    // console.log('after cleaning: ' + pubSvcProcessTime);
                    // console.log('after cleaning: ' + pubSvcReqDocs);

                    //do not use now lest u break the ssml because of a </p>
                    // pubSvcInfo = pubSvcInfo.substr(0,400);


                    if (response.response.numFound > 0) {
                        //This is an AllInclusive :-) for testing
                        this.response.speak("<p> Ich finde: " + pubSvcName + "</p> Die Voraussetzungen dafür sind: " + pubSvcPrereq
                            + '<p> Wenn Sie weitere Fragen zur Bearbeitungszeit dieser oder anderer Dienstleistungen' +
                            ' haben, berate ich Sie gerne.</p>');

                        //TODO check for each of the 5 slots - ask the user, then return the results if
                        // they want (i.e. if it is validated and resolves to ja
                        if(slotValues.prerequisites_flag.isValidated == true && slotValues.prerequisites_flag.resolved =='ja'){
                            this.response.listen(say)//todoetc
                                .cardRenderer(pubSvcName, Helper.reformatJSONtoAlexaFriendly(pubSvcPrereq));
                        }




                        // 'Dienstleistung resolved to,  ' + slotValues.Dienstleistung.resolved + '. ' +
                        // 'prerequisites_flag resolved to,  ' + slotValues.prerequisites_flag.resolved + '. ';


                    } else {
                        this.response.speak('Dafür liefert mir Solr Null ergebnisse');
                    }

                    console.log("response: ", response);

                }
            ).catch(error => {
            console.log(error);
            this.response.speak("Tut mir Leid. Solr hat grad Feierabend. ");

        }).then(() => {
                // after we get a result, have Alexa speak.
                this.emit(':responseReady');
            }
        );
        // }
    },






    'DL_Book_Intent_Termin_buchen_fuer_eine_Dienstleistung': function () {
        // delegate to Alexa to collect all the required slots
        // here a confirmation of the service name

        //autofill slots when using simulator, dialog management is only supportedwith a device
        let isTestingWithSimulator = false;
        let filledSlots = Helper.delegateSlotCollection.call(this, isTestingWithSimulator);

        if (!filledSlots) {
            return;
        }

        console.log("filled slots: " + JSON.stringify(filledSlots));
        // at this point, we know that all required slots are filled.
        let slotValues = Helper.getSlotValues(filledSlots);

        console.log('slot values: ' + JSON.stringify(slotValues));

        // e.g. "select?q=personalausweis&wt=json&indent=true"
        let solrquery = slotValues.Dienstleistung.resolved.replace(/ /g, '+');
        let endpointOptions = "select?q=" + solrquery + "&wt=json&indent=true";
        let docIndex = 0;
        let say = '';


//TODO you want to change the parameter to what it has been resolved

        // if(slotValues.Dienstleistung.resolved == 'Personalausweis beantragen'){
        console.log('understood for solr: ' + slotValues.Dienstleistung.resolved);

        Helper.httpsGet(Helper.buildHttpGetOptions(endpointOptions))
            .then(
                response => {
                    console.log(" RESULTS: ", JSON.stringify(response));

                    let pubSvcName = JSON.stringify(response.response.docs[docIndex].d115Name);
                    console.log('pubSvcName: ' + pubSvcName);
                    // let pubSvcInfo = JSON.stringify(response.response.docs[docIndex].d115Description);
                    // console.log('pubSvcInfo: ' + pubSvcInfo);
                    // let pubSvcPrereq = JSON.stringify(response.response.docs[docIndex].d115Prerequisites);
                    // console.log('pubSvcPrereq: ' + pubSvcPrereq);
                    // let pubSvcCost = JSON.stringify(response.response.docs[docIndex].d115Fees);
                    // console.log('pubSvcCost: ' + pubSvcCost);
                    // let pubSvcProcessTime = JSON.stringify(response.response.docs[docIndex].d115ProcessTime);
                    // console.log('pubSvcProcessTime: ' + pubSvcProcessTime);
                    // let pubSvcReqDocs = JSON.stringify(response.response.docs[docIndex].d115Requirements);
                    // console.log('pubSvcReqDocs: ' + pubSvcReqDocs);
                    let pubSvcBookAppointment = JSON.stringify(response.response.docs[docIndex].d115Url);
                    console.log('pubSvcName: ' + pubSvcBookAppointment);


                    //cleaning the string from API here
                    // pubSvcInfo = Helper.reformatHTMLtoAlexaFriendly(pubSvcInfo);
                    // pubSvcPrereq = Helper.reformatHTMLtoAlexaFriendly(pubSvcPrereq);
                    // pubSvcCost = Helper.reformatHTMLtoAlexaFriendly(pubSvcCost);
                    // pubSvcProcessTime = Helper.reformatHTMLtoAlexaFriendly(pubSvcProcessTime);
                    // pubSvcReqDocs = Helper.reformatHTMLtoAlexaFriendly(pubSvcReqDocs);

                    // console.log('after cleaning: ' + pubSvcInfo);
                    // console.log('after cleaning: ' + pubSvcPrereq);
                    // console.log('after cleaning: ' + pubSvcCost);
                    // console.log('after cleaning: ' + pubSvcProcessTime);
                    // console.log('after cleaning: ' + pubSvcReqDocs);
                    console.log('no URL cleaning occurs: ' + pubSvcBookAppointment);


                    //do not use now lest u break the ssml because of a </p>
                    // pubSvcInfo = pubSvcInfo.substr(0,400);


                    if (response.response.numFound > 0) {
                        //This is an AllInclusive :-) for testing
                        this.response.speak("<p> Ich finde: " + pubSvcName + "</p> Allerdings brauche ich eine stärekere" +
                            " API, um Ihnen den Termin zu buchen. Notfalls kann ich Ihnen ganz bald sagen, wann die" +
                            " nächsten Termine sind und den Link auf der angezeigten Karte per SMS verschicken."
                            + '<p> Wenn Sie weitere Fragen zu den nötigen Unterlagen haben, sage ich Ihnen gerne was dazu</p>');

                        //TODO check for each of the 5 slots - ask the user, then return the results if
                        // they want (i.e. if it is validated and resolves to ja
                        if(slotValues.costs_flag.isValidated == true && slotValues.costs_flag.resolved =='ja'){
                            this.response.listen(say)//todoetc
                                .cardRenderer(pubSvcName, pubSvcBookAppointment);

                        }




                        // 'Dienstleistung resolved to,  ' + slotValues.Dienstleistung.resolved + '. ' +
                        // 'prerequisites_flag resolved to,  ' + slotValues.prerequisites_flag.resolved + '. ';


                    } else {
                        this.response.speak('Dafür liefert mir Solr Null ergebnisse');
                    }

                    console.log("response: ", response);

                }
            ).catch(error => {
            console.log(error);
            this.response.speak("Tut mir Leid. Solr hat grad Feierabend. ");

        }).then(() => {
                // after we get a result, have Alexa speak.
                this.emit(':responseReady');
            }
        );
        // }
    },






    'DL_ReqDocs_Intent_Welche_Unterlagen_sind_noetig': function () {
        // delegate to Alexa to collect all the required slots
        // here a confirmation of the service name

        //autofill slots when using simulator, dialog management is only supportedwith a device
        let isTestingWithSimulator = false;
        let filledSlots = Helper.delegateSlotCollection.call(this, isTestingWithSimulator);

        if (!filledSlots) {
            return;
        }

        console.log("filled slots: " + JSON.stringify(filledSlots));
        // at this point, we know that all required slots are filled.
        let slotValues = Helper.getSlotValues(filledSlots);

        console.log('slot values: ' + JSON.stringify(slotValues));

        // e.g. "select?q=personalausweis&wt=json&indent=true"
        let solrquery = slotValues.Dienstleistung.resolved.replace(/ /g, '+');
        let endpointOptions = "select?q=" + solrquery + "&wt=json&indent=true";
        let docIndex = 0;
        let say = '';


//TODO you want to change the parameter to what it has been resolved

        // if(slotValues.Dienstleistung.resolved == 'Personalausweis beantragen'){
        console.log('understood for solr: ' + slotValues.Dienstleistung.resolved);

        Helper.httpsGet(Helper.buildHttpGetOptions(endpointOptions))
            .then(
                response => {
                    console.log(" RESULTS: ", JSON.stringify(response));

                    let pubSvcName = JSON.stringify(response.response.docs[docIndex].d115Name);
                    console.log('pubSvcName: ' + pubSvcName);
                    // let pubSvcInfo = JSON.stringify(response.response.docs[docIndex].d115Description);
                    // console.log('pubSvcInfo: ' + pubSvcInfo);
                    // let pubSvcPrereq = JSON.stringify(response.response.docs[docIndex].d115Prerequisites);
                    // console.log('pubSvcPrereq: ' + pubSvcPrereq);
                    // let pubSvcCost = JSON.stringify(response.response.docs[docIndex].d115Fees);
                    // console.log('pubSvcCost: ' + pubSvcCost);
                    // let pubSvcProcessTime = JSON.stringify(response.response.docs[docIndex].d115ProcessTime);
                    // console.log('pubSvcProcessTime: ' + pubSvcProcessTime);
                    let pubSvcReqDocs = JSON.stringify(response.response.docs[docIndex].d115Requirements);
                    console.log('pubSvcReqDocs: ' + pubSvcReqDocs);

                    //cleaning the string from API here
                    // pubSvcInfo = Helper.reformatHTMLtoAlexaFriendly(pubSvcInfo);
                    // pubSvcPrereq = Helper.reformatHTMLtoAlexaFriendly(pubSvcPrereq);
                    // pubSvcCost = Helper.reformatHTMLtoAlexaFriendly(pubSvcCost);
                    // pubSvcProcessTime = Helper.reformatHTMLtoAlexaFriendly(pubSvcProcessTime);
                    pubSvcReqDocs = Helper.reformatHTMLtoAlexaFriendly(pubSvcReqDocs);

                    // console.log('after cleaning: ' + pubSvcInfo);
                    // console.log('after cleaning: ' + pubSvcPrereq);
                    // console.log('after cleaning: ' + pubSvcCost);
                    // console.log('after cleaning: ' + pubSvcProcessTime);
                    console.log('after cleaning: ' + pubSvcReqDocs);

                    //do not use now lest u break the ssml because of a </p>
                    // pubSvcInfo = pubSvcInfo.substr(0,400);


                    if (response.response.numFound > 0) {
                        //This is an AllInclusive :-) for testing
                        this.response.speak("<p> Ich finde: " + pubSvcName + "</p> Dafür sind folgende Unterlagen nötig: " + pubSvcReqDocs
                            + '<p> Für weitere Fragen stehe ich Ihnen gerne zur Verfügung. </p>');

                        //TODO check for each of the 5 slots - ask the user, then return the results if
                        // they want (i.e. if it is validated and resolves to ja
                        if(slotValues.required_docs_flag.isValidated == true && slotValues.required_docs_flag.resolved =='ja'){
                            this.response.listen(say)//todoetc
                                .cardRenderer(pubSvcName, Helper.reformatJSONtoAlexaFriendly(pubSvcReqDocs));

                        }




                        // 'Dienstleistung resolved to,  ' + slotValues.Dienstleistung.resolved + '. ' +
                        // 'prerequisites_flag resolved to,  ' + slotValues.prerequisites_flag.resolved + '. ';


                    } else {
                        this.response.speak('Dafür liefert mir Solr Null ergebnisse');
                    }

                    console.log("response: ", response);

                }
            ).catch(error => {
            console.log(error);
            this.response.speak("Tut mir Leid. Solr hat grad Feierabend. ");

        }).then(() => {
                // after we get a result, have Alexa speak.
                this.emit(':responseReady');
            }
        );
        // }
    },






    'DL_Processing_Time_Intent_Wie_lange_ist_die_Bearbeitungsdauer': function () {
        // delegate to Alexa to collect all the required slots
        // here a confirmation of the service name

        //autofill slots when using simulator, dialog management is only supportedwith a device
        let isTestingWithSimulator = false;
        let filledSlots = Helper.delegateSlotCollection.call(this, isTestingWithSimulator);

        if (!filledSlots) {
            return;
        }

        console.log("filled slots: " + JSON.stringify(filledSlots));
        // at this point, we know that all required slots are filled.
        let slotValues = Helper.getSlotValues(filledSlots);

        console.log('slot values: ' + JSON.stringify(slotValues));

        // e.g. "select?q=personalausweis&wt=json&indent=true"
        let solrquery = slotValues.Dienstleistung.resolved.replace(/ /g, '+');
        let endpointOptions = "select?q=" + solrquery + "&wt=json&indent=true";
        let docIndex = 0;
        let say = '';


//TODO you want to change the parameter to what it has been resolved

        // if(slotValues.Dienstleistung.resolved == 'Personalausweis beantragen'){
        console.log('understood for solr: ' + slotValues.Dienstleistung.resolved);

        Helper.httpsGet(Helper.buildHttpGetOptions(endpointOptions))
            .then(
                response => {
                    console.log(" RESULTS: ", JSON.stringify(response));

                    let pubSvcName = JSON.stringify(response.response.docs[docIndex].d115Name);
                    console.log('pubSvcName: ' + pubSvcName);
                    // let pubSvcInfo = JSON.stringify(response.response.docs[docIndex].d115Description);
                    // console.log('pubSvcInfo: ' + pubSvcInfo);
                    // let pubSvcPrereq = JSON.stringify(response.response.docs[docIndex].d115Prerequisites);
                    // console.log('pubSvcPrereq: ' + pubSvcPrereq);
                    // let pubSvcCost = JSON.stringify(response.response.docs[docIndex].d115Fees);
                    // console.log('pubSvcCost: ' + pubSvcCost);
                    let pubSvcProcessTime = JSON.stringify(response.response.docs[docIndex].d115ProcessTime);
                    console.log('pubSvcProcessTime: ' + pubSvcProcessTime);
                    // let pubSvcReqDocs = JSON.stringify(response.response.docs[docIndex].d115Requirements);
                    // console.log('pubSvcReqDocs: ' + pubSvcReqDocs);

                    //cleaning the string from API here
                    // pubSvcInfo = Helper.reformatHTMLtoAlexaFriendly(pubSvcInfo);
                    // pubSvcPrereq = Helper.reformatHTMLtoAlexaFriendly(pubSvcPrereq);
                    // pubSvcCost = Helper.reformatHTMLtoAlexaFriendly(pubSvcCost);
                    pubSvcProcessTime = Helper.reformatHTMLtoAlexaFriendly(pubSvcProcessTime);
                    // pubSvcReqDocs = Helper.reformatHTMLtoAlexaFriendly(pubSvcReqDocs);

                    // console.log('after cleaning: ' + pubSvcInfo);
                    // console.log('after cleaning: ' + pubSvcPrereq);
                    // console.log('after cleaning: ' + pubSvcCost);
                    console.log('after cleaning: ' + pubSvcProcessTime);
                    // console.log('after cleaning: ' + pubSvcReqDocs);

                    //do not use now lest u break the ssml because of a </p>
                    // pubSvcInfo = pubSvcInfo.substr(0,400);


                    if (response.response.numFound > 0) {
                        //This is an AllInclusive :-) for testing
                        this.response.speak("<p> Ich finde: " + pubSvcName + "</p> Das nimmt folgendermaßen Zeit in" +
                            " Anspruch: " + pubSvcProcessTime
                            + '<p> Für weitere Fragen stehe ich Ihnen gerne zur Verfügung. </p>');

                        //TODO check for each of the 5 slots - ask the user, then return the results if
                        // they want (i.e. if it is validated and resolves to ja
                        if(slotValues.required_docs_flag.isValidated == true && slotValues.required_docs_flag.resolved =='ja'){
                            this.response.listen(say)//todoetc
                                .cardRenderer(pubSvcName, Helper.reformatJSONtoAlexaFriendly(pubSvcProcessTime));

                        }




                        // 'Dienstleistung resolved to,  ' + slotValues.Dienstleistung.resolved + '. ' +
                        // 'prerequisites_flag resolved to,  ' + slotValues.prerequisites_flag.resolved + '. ';


                    } else {
                        this.response.speak('Dafür liefert mir Solr Null ergebnisse');
                    }

                    console.log("response: ", response);

                }
            ).catch(error => {
            console.log(error);
            this.response.speak("Tut mir Leid. Solr hat grad Feierabend. ");

        }).then(() => {
                // after we get a result, have Alexa speak.
                this.emit(':responseReady');
            }
        );
        // }
    },


    // a group of intents related to becoming a certified doctor in Berlin
    // based on: https://www.berlin.de/lageso/gesundheit/berufe-im-gesundheitswesen/akademisch/
    // includes these services:
    //Approbation als Apotheker - Erteilung - bei abgeschlossener pharmazeutischer Ausbildung im Ausland
    // Approbation als Apotheker - Erteilung - wenn Pharmazeutische Prüfung in Berlin abgelegt
    // Approbation als Arzt - Erteilung - bei abgeschlossener ärztlicher Ausbildung im Ausland
    // Approbation als Arzt - Erteilung - wenn Ärztliche Prüfung in Berlin abgelegt
    // Approbation als Kinder- und Jugendlichenpsychotherapeut - Erteilung - bei ausländischem Ausbildungsabschluss
    // Approbation als Kinder- und Jugendlichenpsychotherapeut - Erteilung - wenn staatliche Prüfung in Berlin abgelegt
    // Approbation als Psychologischer Psychotherapeut - Erteilung - bei abgeschlossener Ausbildung im Ausland
    // Approbation als Psychologischer Psychotherapeut - Erteilung - wenn staatliche Prüfung in Berlin abgelegt
    // Approbation als Tierarzt - Erteilung - bei abgeschlossener tierärztlicher Ausbildung im Ausland
    // Approbation als Tierarzt - Erteilung - wenn Tierärztliche Prüfung in Berlin abgelegt
    // Approbation als Zahnarzt - Erteilung - bei abgeschlossener zahnärztlicher Ausbildung im Ausland
    // Approbation als Zahnarzt - Erteilung - wenn Zahnärztliche Prüfung in Berlin abgelegt
    'DL_Approbation_Intent_Fragen_zum_Thema_zulassung_im_Gesundheitswesen': function () {
        // delegate to Alexa to collect all the required slots
        let isTestingWithSimulator = false; //autofill slots when using simulator, dialog management is only supported
                                            // with a device
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
            'pruefungInBerlin resolved to,  ' + slotValues.pruefungInBerlin.resolved + '. ';

        console.log("Speech output: ", speechOutput);
        this.response.speak(speechOutput);
        this.emit(':responseReady');

        this.emit(':responseReady');
    },


    'DL_Aufenthaltstitel_Intent_Fragen_zur_Aufenthalt_fuer_Auslaender': function () {
        // delegate to Alexa to collect all the required slots
        let isTestingWithSimulator = false; //autofill slots when using simulator, dialog management is only supported
                                            // with a device
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
            'prerequisites_flag resolved to,  ' + slotValues.prerequisites_flag.resolved + '. ';

        console.log("Speech output: ", speechOutput);
        this.response.speak(speechOutput);
        this.emit(':responseReady');

        this.emit(':responseReady');
    },
    'DL_Bafoeg_Intent_Fragen_zum_BAfoeG'                              : function () {
        // delegate to Alexa to collect all the required slots
        let isTestingWithSimulator = false; //autofill slots when using simulator, dialog management is only supported
                                            // with a device
        let filledSlots = Helper.delegateSlotCollection.call(this, isTestingWithSimulator);

        if (!filledSlots) {
            return;
        }

        console.log("filled slots: " + JSON.stringify(filledSlots));
        // at this point, we know that all required slots are filled.
        let slotValues = Helper.getSlotValues(filledSlots);

        console.log(JSON.stringify(slotValues));


        let speechOutput = 'You have filled 2 required slots. ' +
            'bafoegType resolved to,  ' + slotValues.bafoegType.resolved + '. ' +
            'prerequisites_flag resolved to,  ' + slotValues.prerequisites_flag.resolved + '. ';

        console.log("Speech output: ", speechOutput);
        this.response.speak(speechOutput);
        this.emit(':responseReady');

        this.emit(':responseReady');
    },

    //TODO
    'LOC_General_Intent_Fragen_zu_einer_Behoerde': function () {
        let say = 'Hello from LOC_General_Intent. ';

        let slotStatus = '';
        let resolvedSlot;
        let office_type;
        let office_name;
        let district_single_name;
        let district_combo_name;
        let dienstleistung;
        let telefonnummer;

        //   SLOT: office_type
        if (this.event.request.intent.slots.office_type.value) {
            office_type = this.event.request.intent.slots.office_type;
            slotStatus += ' slot office_type was heard as ' + office_type.value + '. ';

            resolvedSlot = Helper.resolveCanonical(office_type);

            if (resolvedSlot != office_type.value) {
                slotStatus += ' which resolved to ' + resolvedSlot;
            }
        } else {
            slotStatus += ' slot office_type is empty. ';
        }

        //   SLOT: office_name
        if (this.event.request.intent.slots.office_name.value) {
            office_name = this.event.request.intent.slots.office_name;
            slotStatus += ' slot office_name was heard as ' + office_name.value + '. ';

            resolvedSlot = Helper.resolveCanonical(office_name);

            if (resolvedSlot != office_name.value) {
                slotStatus += ' which resolved to ' + resolvedSlot;
            }
        } else {
            slotStatus += ' slot office_name is empty. ';
        }

        //   SLOT: district_single_name
        if (this.event.request.intent.slots.district_single_name.value) {
            const district_single_name = this.event.request.intent.slots.district_single_name;
            slotStatus += ' slot district_single_name was heard as ' + district_single_name.value + '. ';

            resolvedSlot = Helper.resolveCanonical(district_single_name);

            if (resolvedSlot != district_single_name.value) {
                slotStatus += ' which resolved to ' + resolvedSlot;
            }
        } else {
            slotStatus += ' slot district_single_name is empty. ';
        }

        //   SLOT: district_combo_name
        if (this.event.request.intent.slots.district_combo_name.value) {
            district_combo_name = this.event.request.intent.slots.district_combo_name;
            slotStatus += ' slot district_combo_name was heard as ' + district_combo_name.value + '. ';

            resolvedSlot = Helper.resolveCanonical(district_combo_name);

            if (resolvedSlot != district_combo_name.value) {
                slotStatus += ' which resolved to ' + resolvedSlot;
            }
        } else {
            slotStatus += ' slot district_combo_name is empty. ';
        }

        //   SLOT: dienstleistung
        if (this.event.request.intent.slots.dienstleistung.value) {
            dienstleistung = this.event.request.intent.slots.dienstleistung;
            slotStatus += ' slot dienstleistung was heard as ' + dienstleistung.value + '. ';

            resolvedSlot = Helper.resolveCanonical(dienstleistung);

            if (resolvedSlot != dienstleistung.value) {
                slotStatus += ' which resolved to ' + resolvedSlot;
            }
        } else {
            slotStatus += ' slot dienstleistung is empty. ';
        }

        //   SLOT: telefonnummer
        if (this.event.request.intent.slots.telefonnummer.value) {
            telefonnummer = this.event.request.intent.slots.telefonnummer;
            slotStatus += ' slot telefonnummer was heard as ' + telefonnummer.value + '. ';

            resolvedSlot = Helper.resolveCanonical(telefonnummer);

            if (resolvedSlot != telefonnummer.value) {
                slotStatus += ' which resolved to ' + resolvedSlot;
            }
        } else {
            slotStatus += ' slot telefonnummer is empty. ';
        }


        say += slotStatus;

        this.response
            .speak(say)
            .listen('try again, ' + say)
            .cardRenderer('LOC_General_Intent', 'slot office_type is ' + office_type.value + '. slot office_name is ' + office_name.value + '. slot district_single_name is ' + district_single_name.value + '. slot district_combo_name is ' + district_combo_name.value + '. slot dienstleistung is ' + dienstleistung.value + '. slot telefonnummer is ' + telefonnummer.value + '. ');


        this.emit(':responseReady');
    },

    //TODO - JSON gives me the service number and the related offices,
    'LOC_IsSvcAvlbl_Intent_Fragen_ob_ein_dienst_verfuegbar_ist': function () {
        let say = 'Hello from LOC_IsSvcAvlbl_Intent. ';

        let slotStatus = '';
        let resolvedSlot;
        let dienstleistung;
        let officeType;
        let district;
        let onlineAntrag;

        //   SLOT: dienstleistung
        if (this.event.request.intent.slots.dienstleistung.value) {
            dienstleistung = this.event.request.intent.slots.dienstleistung;
            console.log('Dienstleistung heard as: ' + dienstleistung.value);

            slotStatus += 'Die Frage war, ob ' + dienstleistung.value + 'online oder in einem Bezirksamt erhältlich ist. ' +
                "über online habe ich noch keine Auskunft. Und über die Dienstleistung an sich muss ich erstmal denken. "

            resolvedSlot = Helper.resolveCanonical(dienstleistung);

            if (resolvedSlot != dienstleistung.value) {
                slotStatus += ' Soll das ' + resolvedSlot + 'sein?';
            }
        } else {
            slotStatus += ' Habe keine Dienstleistung verstanden. ';
        }

        //   SLOT: officeType
        if (this.event.request.intent.slots.officeType.value) {
            officeType = this.event.request.intent.slots.officeType;
            slotStatus += ' slot officeType was heard as ' + officeType.value + '. ';

            resolvedSlot = Helper.resolveCanonical(officeType);

            if (resolvedSlot != officeType.value) {
                slotStatus += ' which resolved to ' + resolvedSlot;
            }
        } else {
            slotStatus += ' slot officeType is empty. ';
        }

        //   SLOT: district
        if (this.event.request.intent.slots.district.value) {
            district = this.event.request.intent.slots.district;
            slotStatus += ' slot district was heard as ' + district.value + '. ';

            resolvedSlot = Helper.resolveCanonical(district);

            if (resolvedSlot != district.value) {
                slotStatus += ' which resolved to ' + resolvedSlot;
            }
        } else {
            slotStatus += ' slot district is empty. ';
        }

        //   SLOT: onlineAntrag
        if (this.event.request.intent.slots.onlineAntrag.value) {
            onlineAntrag = this.event.request.intent.slots.onlineAntrag;
            slotStatus += ' slot onlineAntrag was heard as ' + onlineAntrag.value + '. ';

            resolvedSlot = Helper.resolveCanonical(onlineAntrag);

            if (resolvedSlot != onlineAntrag.value) {
                slotStatus += ' which resolved to ' + resolvedSlot;
            }
        } else {
            slotStatus += ' slot onlineAntrag is empty. ';
        }


        say += slotStatus;

        this.response
            .speak(say)
            .listen('try again, ' + say)
            .cardRenderer('LOC_IsSvcAvlbl_Intent', 'slot dienstleistung is ' + dienstleistung.value + '. slot officeType is ' + officeType.value + '. slot district is ' + district.value + '. slot onlineAntrag is ' + onlineAntrag.value + '. ');


        this.emit(':responseReady');
    },

    //Find a Berlin Postleitzahl (Postal Code) and tell to which district mayorship it belongs to
    //Ask "Wo ist Kreuzberg, 10 5 8 7, Lichtenberg, 1 0 9 9 9 "
    'LOC_WhereIsAreaOrPLZ_Intent_Postleitzahl_und_Ortssuche': function () {
        console.log('Hello from LOC_Where Is Area Or PostLeitZahl_Intent. ');
        let say = '';
        let cardInputText = '';
        let heard_plz_district;

        let slotStatus = '';
        let resolvedSlot;
        let verifiedSlot;
        let resolvedSlotWappen;


        //   SLOT: plz_district
        if (this.event.request.intent.slots.plz_district.value) {
            heard_plz_district = this.event.request.intent.slots.plz_district;
            slotStatus += heard_plz_district.value;
            resolvedSlot = Helper.resolveCanonical(heard_plz_district);

            console.log('heard: ' + heard_plz_district.value);
            console.log('canonical: ' + resolvedSlot);
            console.log(
                'is a valid postal code (PLZ): ' + Helper.listOfPLZ.indexOf(heard_plz_district.value) > -1 + '\n' +
                'is an area (Ortsteil): ' + Helper.listOfAreas.includes(heard_plz_district.value) + '\n' +
                'is a Bezirksamt: ' + Helper.listOfComboDistricts.includes(heard_plz_district.value) + '\n' +
                'is a Bezirksamt w Hyphens: ' + Helper.listOfComboDistrictsNoHyphens.includes(heard_plz_district.value) + '\n' +
                'is an area and not a Bezirksamt: ' + resolvedSlot != heard_plz_district.value + '\n' +
                'is included in list of Bezirksämter ' + Helper.listOfComboDistricts.indexOf(resolvedSlot) > -1
            );


            //play some wise words
            if (heard_plz_district.value === 'Berlin')
                slotStatus = "<audio src='https://s3.eu-central-1.amazonaws.com/megantosh/aimeejaguarberlinloud.mp3' />";
            //exception (Pun) intended!
            else if (heard_plz_district.value === 'Bielefeld') //|| heard_plz_district.value ==='bielefeld')
                slotStatus =
                    // "<amazon:effect name='whispered'> " +
                    "Bielefeld gibt's nicht. " +
                    // "</amazon:effect>" +
                    "<say-as interpret-as='interjection'>hihi</say-as>";
            //TODO Validator as Alexa makes up PLZs of her own!!
            //e.g. She would say "Reinickendorf Nord ist in Reinickendorf Nord"
            //e.g. She would say " 19388 ist in Pankow since Pankow has a PLZ with 13088
            //check if heard_plz_district is in the list of districts (in Strings)
            else if (
                ((Helper.listOfPLZ.indexOf(heard_plz_district.value) > -1 ) || //is a valid postal code (PLZ)
                    (Helper.listOfAreas.includes(heard_plz_district.value)) || //or an area (Ortsteil)
                    (Helper.listOfComboDistricts.includes(heard_plz_district.value)) || //or a Bezirksamt
                    (Helper.listOfComboDistrictsNoHyphens.includes(heard_plz_district.value))) //or a Bezirksamt
            ) {
                if (
                    resolvedSlot.toUpperCase() == heard_plz_district.value.toUpperCase()
                    &&
                    (Helper.listOfComboDistrictsNoHyphens.includes(heard_plz_district.value.toLowerCase()))
                ) {
                    slotStatus += ' ist einer der zwölf Bezirksämter Berlins';
                    verifiedSlot = 'Bezirksamt';
                } else {
                    slotStatus += ' ist in Bezirksamt ' + resolvedSlot;
                    verifiedSlot = resolvedSlot;
                }
            } else {
                slotStatus = 'Von diesem Ort habe ich nie in Berlin gehört.';
                verifiedSlot = 'In der Bundeshauptstadt bestimmt nüscht!'
            }
        }


        //if a PLZ belongs to multiple districts
        //TODO you want to use the list of Helpler.resolveMulti and verify it against the real hits.
        //check if:
        //de_DE_model.interactionModel.languageModel.types.name == Districts_PLZ_Combo_BER.
        // parent node's values[i].name.value
        // includes()
        //de_DE_model.interactionModel.languageModel.types.name == Districts_PLZ_Combo_BER.
        // parent node's values[i].name.synonyms


        //TODO+ if Validator resolves to many districts!
        //TODO+ ignore case
        //then check if resolvedSlot is in the list of Bezirksämter

        //TODO 'und hat die Ortsteile ...'.
        //TODO+ render a card of the Wappen

        cardInputText = Helper.writeDigits(heard_plz_district.value, 'de_DE');


        // console.log(typeof cardInputText); returns string
        // console.log(cardInputText);
        // console.log(Helper.coatOfArmsSelector(resolvedSlot));
        resolvedSlotWappen = Helper.coatOfArmsTextSelector(resolvedSlot);


        say += slotStatus;

        this.response
            .speak(say)
            .cardRenderer(cardInputText, verifiedSlot, Card.berlinWappen[resolvedSlotWappen])
            .listen(Helper.randomphrase(Speech.de.BEFORE_ENDING_SESSION_TEXT));

        this.emit(':responseReady');
    },


    'ST_BerlinStats_Intent_Fakten_und_zahlen_ueber_Berlin': function () {
        let say = 'Hello from ST_BerlinStats_Intent. ';

        var slotStatus = '';
        var resolvedSlot;

        //   SLOT: statistic
        if (this.event.request.intent.slots.statistic.value) {
            const statistic = this.event.request.intent.slots.statistic;
            slotStatus += ' slot statistic was heard as ' + statistic.value + '. ';

            resolvedSlot = Helper.resolveCanonical(statistic);

            if (resolvedSlot != statistic.value) {
                slotStatus += ' which resolved to ' + resolvedSlot;
            }
        } else {
            slotStatus += ' slot statistic is empty. ';
        }


        say += slotStatus;

        this.response
            .speak(say)
            .listen('try again, ' + say)
            .cardRenderer('ST_BerlinStats_Intent', 'slot statistic is ' + statistic.value + '. ');


        this.emit(':responseReady');
    },

    //smalltalk intents. Meaningless and growing list to catch some of the weird stuff
    // before it goes to the eternally unhandled function. TODO: Interaction Model Mit Synonyme bereichern
    'ST_FromChatbot_Intent_Fragen_ueber_mich_als_Alexa_im_Amt': function () {
        console.log('Hello from ST_FromChatbot_Intent.');
        let say = '';

        let slotStatus = '';
        let resolvedSlot;
        let smalltalk;

        //   SLOT: smalltalk
        if (this.event.request.intent.slots.smalltalk.value) {
            smalltalk = this.event.request.intent.slots.smalltalk;
            console.log(' slot smalltalk was heard as ' + smalltalk.value + '. ');
            slotStatus = smalltalk.value;
            resolvedSlot = Helper.resolveCanonical(smalltalk);


            say += ' lustig, aber '; // + smalltalk.value + '. ';


            if (resolvedSlot != smalltalk.value) {
                console.log('which resolves to: ' + resolvedSlot);
                switch (resolvedSlot) {
                    case "wann hat man dich gebaut":
                        say += Helper.randomphrase(Speech.de.SMALLTALK_BAUJAHR);
                        break;
                    case "erzähl von dir selbst":
                        say += "Da bin ich zu schüchtern für.";
                        break;
                    case "hiiiiii":
                        say += "Tach auch";
                        break;
                }
            }
        } else {
            say += ' bin noch zu jung zu wissen, was man bei sowas sagen soll.'; // slot smalltalk is empty. ';
        }

        this.response
            .speak(say)
            .listen('ich merke Ihre bürokratische Kenntnisse sind so gut, dass sie keine Fragen für mich haben!') //try agn
        //.cardRenderer('ST_FromChatbot_Intent', 'slot smalltalk is ' + smalltalk.value + '. ');

        this.emit(':responseReady');
    }
};

//  ------ Helper Functions -----------------------------------------------


// Given the request an slot name, slotHasValue returns the slot value if one
// was given for `slotName`. Otherwise returns false.
function slotHasValue(request, slotName) {

    let slot = request.intent.slots[slotName];

    //uncomment if you want to see the request
    //console.log("request = "+JSON.stringify(request));
    let slotValue;

    //if we have a slot, get the text and store it into speechOutput
    if (slot && slot.value) {
        //we have a value in the slot
        slotValue = slot.value.toLowerCase();
        return slotValue;
    } else {
        //we didn't get a value in the slot.
        return false;
    }
}

// End Skill Code


// ------ Next Steps -----------------------------------------------


//TODO: Make Alexa ask for help only the first few times
//TODO use resolveMulti to get when an Ort s in two Bezirksämter


// ------ Unused Vars -----------------------------------------------


// in combination with alexa.resources
// const languageStrings = {
//     'en': {
//         'translation': {
//             'WELCOME1' : 'Welcome to berlin service!',
//             'WELCOME2' : 'Greetings!',
//             'WELCOME3' : 'Hello there!',
//             'HELP'    : 'You can say help, stop, or cancel. ',
//             'STOP'    : 'Goodbye!'
//         }
//     }
//     // , 'de-DE': { 'translation' : { 'WELCOME'   : 'German Welcome etc.' } }
//     // , 'jp-JP': { 'translation' : { 'WELCOME'   : 'Japanese Welcome etc.' } }
// };