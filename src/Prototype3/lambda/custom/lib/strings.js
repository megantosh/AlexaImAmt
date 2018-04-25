// Things Alexa would say. phrases or complete sentences
// use '?' to read a question
// deprecated this.t = 'GREETINGS' to read the string properties
// splitting preferred method for multilingual skill

const Helper = require("./helper.js");
//WARNING: appending 'http', 'https' breaks the URL object
const base_url = 'service.berlin.de';

//****************************************************************
// Defaults
//****************************************************************

exports.defaultSpokenStrings = {
    'en':
        {
            INTRO_GREETING_TEXT: [
                'you seem like a foreigner to me. How long have you been in Berlin for you no to speak to me in German?',
                'Ey, wir sind in Deutschland.. Speak german with me please!'
            ],
            INTRO_HELP_TEXT: "You can try: 'alexa, until when is Standesamt Friedrichshain-Kreuzberg open today'" +
            "or 'alexa, ask hello world my name is awesome Aaron'",
            INTRO_UNHANDLED_TEXT: "Sorry, I didn't get that. You can try: 'alexa, how do I transfer my driving license to a german one?'" +
            " or 'alexa, ask Berlin D. E. when is the nearest city hall open today?'",
            INTRO_STOP_TEXT: [
                "always at your service.",
                "I'll try to get better next time"
            ],
            INTRO_CANCEL_TEXT: 'OK, Bye',
            INTRO_WIP_TEXT : 'Skill under development.'
        },
    'de':
        {
            INTRO_GREETING_TEXT: [
                'Ich kann dir mit den zahlreichen Dienstleistungen der Stadt Berlin helfen! ' +
                'Möchtest Du dich über Öffnungszeiten oder eine Dienstleistung informieren?',
                'Willkommen in dem Hauptstadtportal. Was kann ich für dich tun?'
            ],
            INTRO_HELP_TEXT: "Du kannst mich nach einer Dienstleistung fragen." +
            "Probiere zum Beispiel 'Anmeldung einer Wohnung' oder 'Ich möchte eine Wohnung anmelden.",
            INTRO_UNHANDLED_TEXT: [
                "Sorry, das habe ich nicht verstanden. Probiere mal: 'alexa, wann hat das Bürgeramt Venus auf?'" +
                " oder 'Alexa, frag Berlin D. E. wann hat das Bürgeramt in der Nähe auf heute'.'",
                'Pardon, das habe ich nicht richtig mitbekommen.'
            ],
            INTRO_STOP_TEXT: [
                "ich halte mich fern",
            ],
            INTRO_CANCEL_TEXT: 'ich bin weg',
            INTRO_WIP_TEXT : [
                'Skill wird gerade entwickelt.',
                'das berücksichtige ich gerne beim nächsten Milestone',
                'ich mag es, wie du mich ausfragst. Du solltest eine Karriere im Usability Bereich in Erwägung ziehen.',
                'ich werde zwar von einem mega entwickelt, aber leider geht das nicht mega schnell'
                ]
        }
}

//each card uses two variables. remember to reference them in the card by index
exports.defaultCardStrings = {
    'de':
        {
            INTRO_GREETING_TEXT: [
                'Willkommen beim virtuellen Service-Assistent der Stadt Berlin',
                'Disclaimer: Beta Version - This skill is in no way affiliated with Berlin.de website' + ' - Alle Angaben ohne Gewähr'
            ]
        },

    'en':
        {}
}




//TODO set default values - these are still from petmatch
// This data is for testing purposes.
// When isTestingWithSimulator is set to true
// The slots will be auto loaded with this default data.
// Set isTestingWithSimulator to false to disable to default data
const defaultData = [
    {
        "name": "pet",
        "value": "pooch",
        "ERCode": "ER_SUCCESS_MATCH",
        "ERValues": [
            { "value": "dog" }
        ]
    },
    {
        "name": "energy",
        "value": "play fetch with",
        "ERCode": "ER_SUCCESS_MATCH",
        "ERValues": [
            { "value": "high" },
        ]
    },
    {
        "name": "size",
        "value": "mini",
        "ERCode": "ER_SUCCESS_MATCH",
        "ERValues": [
            { "value": "small" },
            { "value": "tiny" }
        ]
    },
    {
        "name": "temperament",
        "value": "guard",
        "ERCode": "ER_SUCCESS_NO_MATCH",
    },
];


//****************************************************************
// Intent Maps
//****************************************************************



exports.Dienstleistung_IntentSpokenStrings = {
    'de':
        {
            //When less parameters are sent to request(options), it will resolve the default values.
            //TODO dynamic url resloution - routing
            PersoIntent : Helper.httpsGet(Helper.buildHttpGetOptions(base_url,'/dienstleistung/120703'))
            //PersoIntent: Helper.httpsGet('https://' + base_url + '/dienstleistung/120703/')

            // TODO: lambda solr server beta3 andreas, dont forget to set the timeout in ask console
            // or Lambda frontend for a high time otherwise u might never get an answer

        },
    'en':
        {
            //TODO
        }
}




//Oskar's suggestion
export default defaultData;




//TODO get the formatted json and read the content
//alternatively, get from the page the proper term and use the block/url
// var getSearchContent = function (base_url, path, search_term) {
//
// }



// when the user asks a question - get the “questionmark” from the transcribed string then answer:
//     Kenn ich nicht, aber lass und auf das wesentliche konzentieren
// Gute Frage, aber …
// Das ist ja ein Statement, aber..
// Das sagt mit bestimmt was im einer zeitnahen Zukunft
// TODO: then log ig as a missed intent

// TODO: Smalltalk core einbinden.
http://newsreel-edu.aot.tu-berlin.de/solr/smalltalk/select?q=willst&wt=json&indent=true