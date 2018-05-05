// Author: Mohamed Megahed

//Step-by-step recommendation:
//start with interaction model
//then use builder: http://alexa.design/skillcode
//then fulfill functions



const Helper = require("./lib/helper.js");
const Speech = require("./lib/speeches.js");
const Card = require("./lib/cards.js");

const http = require('http');
const https = require('https');
const url = require("url");
const Alexa = require("alexa-sdk");
const AWS = require("aws-sdk");

//replace with respective Skill ID from dev console (OPTIONAL).
const APP_ID = 'amzn1.ask.skill.d7732837-fab2-42ff-a152-4eb0fc4ee646';
//force use Ireland Server (at the time of dev, this was the closes
AWS.config.update({region: "eu-west-1"});

const hamada= "http://newsreel-edu.aot.tu-berlin.de/solr/d115/select?q=personalausweis&wt=json&indent=true";


exports.handler = function(event, context, callback) {
    let alexa = Alexa.handler(event, context);
    // was changed from alexa.APP_ID in old API
    alexa.appId = APP_ID;

    //alexa.resources = Speech.defaultSpokenStrings;

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

//the old name we use to access this skill
//has to consist of at least two words
//ber lin works better tan bär leen
// const invocationName = "bär leen";

//what Alexa will do if we get into any of the keys found in de_DE.json
//german interaction model
const DE_handlers = {


    //TODO: Make Alexa ask for help only the first few times
    'LaunchRequest': function () {
        //another sample
        //" <audio src='https://s3.amazonaws.com/my-ssml-samples/Flourish.mp3' /> "
        let startConversation = " OK " +
            // "<audio src='https://s3.eu-central-1.amazonaws.com/megantosh/RegioSound-48kbps.mp3' /> " +
            "<audio src='https://s3.amazonaws.com/ask-soundlibrary/office/amzn_sfx_typing_medium_02.mp3'/>" +
            Helper.randomphrase(Speech.de.INTRO_GREETING_TEXT);

        this.response
        this.emit(':ask', startConversation, Speech.de.HELP_TEXT);
        // need a real Echo to check this!
        //     .listen('Hmm.. ' + Helper.randomphrase(Speech.de.INTRO_HELP_TEXT));
        this.emit(':responseReady');
    },
    'Unhandled': function () {
        this.response
            .speak(Speech.de.INTRO_UNHANDLED_TEXT)
            .listen(Helper.randomphrase(Speech.de.INTRO_UNHANDLED_TEXT));
    },

    'AMAZON.CancelIntent': function () {
        this.response
        //TODO
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






    //https://www.berlin.de/lageso/gesundheit/berufe-im-gesundheitswesen/akademisch/
    'DL_Approbation_Intent': function () {
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
            'pruefungInBerlin resolved to,  ' + slotValues.pruefungInBerlin.resolved + '. ';

        console.log("Speech output: ", speechOutput);
        this.response.speak(speechOutput);
        this.emit(':responseReady');

        this.emit(':responseReady');
    },

    // Anything else like Perso, etc. Check DE_LIST_OF_PUB_SVCs
    'DL_GeneralIntent': function () {
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

        //TODO if personalausweis,  interrupt the "ist es dein erster Antrag"
        // and proceed with something else but also get the other required slots after
        // since it is a bit unexpected to think that Alexa works only with 16 year-olds
        // oder recently eingebürgerte menschen haha


        let speechOutput = 'You have filled 3 required slots. ' +
            'Dienstleistung resolved to,  ' + slotValues.Dienstleistung.resolved + '. ' +
            'extension_flag resolved to,  ' + slotValues.extension_flag.resolved + '. ' +
            'prerequisites_flag resolved to,  ' + slotValues.prerequisites_flag.resolved + '. ';

        console.log("Speech output: ", speechOutput);
        this.response.speak(speechOutput);
        this.emit(':responseReady');

        this.emit(':responseReady');
    },
    //This intent deals with D115 services No:
    //
    //TODO ssml flüstern oder so
    //https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html

    //TODO with ifElse forward to right intent if certain slots are fulfilled
    // a handler (like launchrequest) forwards with :
    // inside 'LaunchAufenthaltRequest': function() {
    // if slot value equals egyptian:
    // this.emit('HelloWorldIntent'); else waddih le bta3et el familienmitglieder z.B
    // }

    'DL_Aufenthaltstitel_Intent': function () {
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

        //TODO - remove
        let speechOutput = 'You have filled 5 required slots. ' +
            'registered_in_berlin resolved to,  ' + slotValues.registered_in_berlin.resolved + '. ' +
            'citizenship resolved to,  ' + slotValues.citizenship.resolved + '. ' +
            'residence_purpose resolved to,  ' + slotValues.residence_purpose.resolved + '. ' +
            'extension_flag resolved to,  ' + slotValues.extension_flag.resolved + '. ' +
            'prerequisites_flag resolved to,  ' + slotValues.prerequisites_flag.resolved + '. ' ;

        console.log("Speech output: ", speechOutput);

        //TODO insert switch cases / if/else for each service caught from the params
        Helper.httpGet()

        this.response.speak(speechOutput);
        this.emit(':responseReady');

        this.emit(':responseReady');
    },

    //This Intent deals with services :
    'DL_Bafoeg_Intent': function () {
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
    'LOC_General_Intent': function () {
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
    'ST_Unimplemented_Intent': function () {
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
    'ST_BerlinStats_Intents': function () {
        let say = 'Hello from ST_BerlinIntents. ';

        this.response
            .speak(say)
            .listen('try again, ' + say)
            .cardRenderer('ST_BerlinIntents', '');


        this.emit(':responseReady');
    },
};




//TODO wienbotIntents that need more structure
// wie lange ist die donauinsel
// wie lange ist kurzparkzone in ottakring
// ich habe etwas verloren
//
// future Dienstleistungen:
// parken








// Skill logic in English (US) =======================================================================================
// const invocationName = "ber lynn", no longer "berlin service";
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

    // https://formular.berlin.de/xima-forms-29/get/14963116144270000?mandantid=/OTVBerlin_LABO_XIMA/000-01/instantiationTasks.properties
    'DL_AufenthaltstitelIntent': function () {
        let say = 'Hello from DL_AufenthaltstitelIntent. ';

        this.response
            .speak(say)
            .listen('try again, ' + say)
            .cardRenderer('DL_AufenthaltstitelIntent', '');


        this.emit(':responseReady');
    },

    //TODO: what to do with *staatenlos, ungeklärt Syr/Kurd/Palästinenser (Siehe JSON_semi ready)
    // how to handle côte d'Ivoire (Ivory coast, Elfenbeinküste), overseas territory
    // list of nats w synonyms https://www.ef.com/english-resources/english-grammar/nationalities/

    // TODO: you want to make a card that shows sth like the brie skill with autos and services related:
    // https://developer.amazon.com/designing-for-voice/what-alexa-says/

    // 'DL_FahrerlaubnisIntent' : function () {
    //     // delegate to Alexa to collect all the required slots
    //     let isTestingWithSimulator = false; //autofill slots when using simulator, dialog management is only supported with a device
    //     let filledSlots = delegateSlotCollection.call(this, isTestingWithSimulator);
    //
    //     if (!filledSlots) {
    //         return;
    //     }
    //
    //     console.log("filled slots: " + JSON.stringify(filledSlots));
    //     // at this point, we know that all required slots are filled.
    //     let slotValues = getSlotValues(filledSlots);
    //
    //     console.log(JSON.stringify(slotValues));
    //
    //
    //     let speechOutput = 'You have filled 1 required slots. ' +
    //         'country_of_license resolved to,  ' + slotValues.country_of_license.resolved + '. ' ;
    //
    //     console.log("Speech output: ", speechOutput);
    //     this.response.speak(speechOutput);
    //     this.emit(':responseReady');
    //
    //     this.emit(':responseReady');
    // },


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

        //TODO replace ist das dein erster Antrag with the respective question and
        // do not delegate this to the interaction model - via check dialogState

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

        //TODO case- kirschen pflücken: geh auf https://mundraub.org/ - hat gute tips

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

    //This is the entry point of the conversation - trigger invocation name
    'LaunchRequest': function () {
        // what does berlin sound like? http://www.dw.com/en/berlin-24-7-the-sound-of-berlin/a-42603411
        //more info on using SSML:
        //https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html#audio
        let startConversation = " OK <audio src='https://s3.eu-central-1.amazonaws.com/megantosh/RegioSound-48kbps.mp3' /> " +
            Helper.randomphrase(Speech.en.INTRO_GREETING_TEXT);

        let hamada= "http://newsreel-edu.aot.tu-berlin.de/solr/d115/select?q=personalausweis&wt=json&indent=true";

        console.log("in LaunchIntent");

        // //TODO experiment area
        //
        // console.log(Helper.buildHttpGetOptions("https://personal-assistent:AlexaAlexa0815.@newsreel-edu.aot.tu-berlin.de/solr/", "d115/select?q=personalausweis&wt=json&indent=true", 443));
        //
        // console.log('this is more important');
        //
        // //console.log('https://personal-assistent:AlexaAlexa0815.@newsreel-edu.aot.tu-berlin.de/solr/d115/select?q=personalausweis&wt=json&indent=true');
        //
        // console.log(Helper.httpGet(Helper.buildHttpGetOptions("https://personal-assistent:AlexaAlexa0815.@newsreel-edu.aot.tu-berlin.de/solr/", "d115/select?q=personalausweis&wt=json&indent=true", 443)));
        //
        // console.log(getAstrosHttp(data));
        //


        // var hamada = https.request("https://newsreel-edu.aot.tu-berlin.de/solr/");
        // console.log(hamada.getHeader);



        Helper.httpsGet(Helper.buildHttpGetOptions("select?q=personalausweis&wt=json&indent=true"))
            .then(
                response => {
                    console.log(" RESULTS: ", JSON.stringify(response));

                    let elMegaout = JSON.stringify(response.response.numFound);
                    console.log(elMegaout);


    //                let pastMatch = buildPastMatchObject(response, slotValues);
    //                saveValue.call(this, { data: pastMatch, fieldName: 'past_matches', append: true});
                    // You can uncomment these lines to render an image of a dog.
                    // It will appear in the companion app. See Part 3 Extra Credit
                    // for more details: https://developer.amazon.com/docs/custom-skills/include-a-card-in-your-skills-response.html
                    // let dogBreedImage = {
                    //    "smallImageUrl": "Replace with image url",
                    //    "largeImageUrl": "Replace with image url"
                    // };
                    // this.response.cardRenderer('Your pet match is ...', `A ${response.result[0].breed}`,
                    //                            dogBreedImage);
    //
                   if( response.response.numFound > 0 ) {
                       this.response.speak("So a ${response.response.numFound}" + elMegaout);
    //                        + slotValues.size.resolved + " "
    //                        + slotValues.temperament.resolved + " "
    //                        + slotValues.energy.resolved
    //                        + " energy dog sounds good for you. Consider a "
    //                        + response.result[0].breed);
                   } else {
                       this.response.speak("I'm sorry I could not find a match for a "
    //                        + slotValues.size.resolved + " "
    //                        + slotValues.temperament.resolved + " "
    //                        + slotValues.energy.resolved
                           + " dog");
                   }

                    console.log("response: ", response);

                }
            ).catch( error => {
                console.log(error);
                this.response.speak("I'm really sorry. I'm unable to access part of my memory. Please try again later.");
                // Part 3: Extra Credit 3: save all the slots and create an
                // utterance so the user can pick up where they left off
                // HINT 1: You can use saveValue to save the slot values.
                // HINT 2: You can automate the recovery the next time the user
                // invokes your skill, you can check if there was an error and skip
                // right to the look up.

            }).then(() => {
                    // after we get a result, have Alexa speak.
                    this.emit(':responseReady');
                }
            );
        },

    'Unhandled': function () {
        this.response
            .speak(Helper.randomphrase(Speech.en.INTRO_UNHANDLED_TEXT))
            .listen(Helper.randomphrase(Speech.en.INTRO_UNHANDLED_TEXT));
        }
    };


// ====== End of Skill ==============================================================================================


function getAstrosHttps(endpointUrl, callback) {
    //http://api.open-notify.org/astros.json
    //http://newsreel-edu.aot.tu-berlin.de/solr/d115/select?q=personalausweis&wt=json&indent=true

    var options = //"https://newsreel-edu.aot.tu-berlin.de/solr/"
        {
            host: url.parse(endpointUrl).hostname,
            port: url.parse(endpointUrl).port,
            path: url.parse(endpointUrl).path,
            // host: "newsreel-edu.aot.tu-berlin.de/solr/",
            // port: 443,
            // path: "d115/select?q=personalausweis&wt=json&indent=true",
            // //open api for astraunauts
            // host: 'api.open-notify.org',
            // port: 80,
            // path: '/astros.json',
            method: 'GET',
            rejectUnauthorized: false,
            auth: "personal-assistent:AlexaAlexa0815."
        };

    var req = https.request(options, res => {
        // var req = https.request(options, res => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });

        res.on('end', () => {
            var result = JSON.parse(returnData);
            console.log('No more data in response.');
            //callback: error, data
            return callback(null, result);
            // callback(result);

        });
        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });
    });
    req.end();
}





// End Skill Code















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

















// ===== Strings =====
// const defaultSpokenStrings = {
//     'en':
//         {
//             GREETING_TEXT: [
//                 'Welcome to Berlin',
//                 'I can help you with a few public services.'
//
//             ],
//             HELP_TEXT: //"You can try: 'alexa, until when is Standesamt Friedrichshain-Kreuzberg open today'" +
//                 "Try asking me how to get your visa extended",
//             UNHANDLED_TEXT: "Sorry, I didn't get that. You can try: 'alexa, how do I transfer my driving license to a german one?'" +
//             " or 'alexa, ask Berlin D. E. when is the nearest city hall open today?'",
//             STOP_TEXT: '',
//             CANCEL_TEXT: [
//                 "always at your service.",
//                 "I'll try to get better next time"
//             ],
//             WIP_TEXT: "I'll find out about that and be ready for your question soon"
//         },
//     'de':
//         {
//             GREETING_TEXT: [
//                 'Ich kann dir mit den zahlreichen Dienstleistungen der Stadt Berlin helfen! ' +
//                 'Möchtest Du dich über Öffnungszeiten oder eine Dienstleistung informieren?',
//                 'Willkommen in dem Hauptstadtportal. Was kann ich für dich tun?'
//             ],
//             HELP_TEXT: "Du kannst mich nach einer Dienstleistung fragen." +
//             "Probiere zum Beispiel 'Anmeldung einer Wohnung' oder 'Ich möchte eine Wohnung anmelden.",
//             UNHANDLED_TEXT: [
//                 "Sorry, das habe ich nicht verstanden. Probiere mal: 'alexa, wann hat das Bürgeramt Venus auf?'" +
//                 " oder 'Alexa, frag Berlin D. E. wann hat das Bürgeramt in der Nähe auf heute'.'",
//                 'Pardon, das habe ich nicht richtig mitbekommen.'
//             ],
//             STOP_TEXT: [
//                 "ich halte mich fern",
//             ],
//             CANCEL_TEXT: 'ich bin weg',
//             WIP_TEXT: [
//                 'Skill wird gerade entwickelt.',
//                 'das berücksichtige ich gerne beim nächsten Milestone',
//                 'ich mag es, wie du mich ausfragst. Du solltest eine Karriere im Usability Bereich in Erwägung ziehen.',
//                 'ich werde zwar von einem mega entwickelt, aber leider geht das nicht mega schnell'
//             ]
//         }
// };
//
//


















// var hello = getAstrosHttps(hamada, (err,data) => {
//
//     console.log(data);
//
//    var outputSpeech = `There are currently ${data.response.length} astronauts in space. `;
// for (var i = 0; i < data.people.length; i++) {
//     if (i === 0) {
//         //first record
//         outputSpeech = outputSpeech + 'Their names are: ' + data.people[i].name + ', '
//     } else if (i === data.people.length - 1) {
//         //last record
//         outputSpeech = outputSpeech + 'and ' + data.people[i].name + '.'
//     } else {
//         //middle record(s)
//         outputSpeech = outputSpeech + data.people[i].name + ', '
//     }
// }

// return data;

// this.emit(':tell', outputSpeech);
// });

// console.log(hello);


//
// this.response
// this.emit(':ask', startConversation, 'did that just work?');
// .listen('Let us try again, ' + Helper.randomphrase(Speech.en.INTRO_HELP_TEXT));
//     this.emit(':responseReady');
// },