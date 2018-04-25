exports.languageStrings = {
    'en': {
        'translation': {
            'WELCOME1': 'Welcome to bär leen!',
            'WELCOME2': 'Greetings!',
            'WELCOME3': 'Hello there!',
            'HELP': 'You can say help, stop, or cancel. ',
            'STOP': 'Goodbye!'
        }
    }
    , 'de-DE': {
        'translation': {
            'WELCOME': 'Moin aus Irland.',
        }
    }
    , 'fr-FR': {
        'translation': {
            'WELCOME': 'Japanese Welcome etc.'
        }
    }
};


const Helper = require("./helper.js");
//WARNING: appending 'http', 'https' breaks the URL object
const base_url = 'service.berlin.de';

//****************************************************************
// Defaults
//****************************************************************

exports.defaultSpokenStrings = {
    'en':
        {
            GREETING_TEXT: [
                'Welcome to Berlin',
                'I can help you with a few public services.'

            ],
            HELP_TEXT: //"You can try: 'alexa, until when is Standesamt Friedrichshain-Kreuzberg open today'" +
                "Try asking me how to get your visa extended",
            UNHANDLED_TEXT: "Sorry, I didn't get that. You can try: 'alexa, how do I transfer my driving license to a german one?'" +
            " or 'alexa, ask Berlin D. E. when is the nearest city hall open today?'",
            STOP_TEXT: '',
            CANCEL_TEXT: [
                "always at your service.",
                "I'll try to get better next time"
            ],
            WIP_TEXT: "I'll find out about that and be ready for your question soon"
        },
    'de':
        {
            GREETING_TEXT: [
                'Ich kann dir mit den zahlreichen Dienstleistungen der Stadt Berlin helfen! ' +
                'Möchtest Du dich über Öffnungszeiten oder eine Dienstleistung informieren?',
                'Willkommen in dem Hauptstadtportal. Was kann ich für dich tun?'
            ],
            HELP_TEXT: "Du kannst mich nach einer Dienstleistung fragen." +
            "Probiere zum Beispiel 'Anmeldung einer Wohnung' oder 'Ich möchte eine Wohnung anmelden.",
            UNHANDLED_TEXT: [
                "Sorry, das habe ich nicht verstanden. Probiere mal: 'alexa, wann hat das Bürgeramt Venus auf?'" +
                " oder 'Alexa, frag Berlin D. E. wann hat das Bürgeramt in der Nähe auf heute'.'",
                'Pardon, das habe ich nicht richtig mitbekommen.'
            ],
            STOP_TEXT: [
                "ich halte mich fern",
            ],
            CANCEL_TEXT: 'ich bin weg',
            WIP_TEXT: [
                'Skill wird gerade entwickelt.',
                'das berücksichtige ich gerne beim nächsten Milestone',
                'ich mag es, wie du mich ausfragst. Du solltest eine Karriere im Usability Bereich in Erwägung ziehen.',
                'ich werde zwar von einem mega entwickelt, aber leider geht das nicht mega schnell'
            ]
        }
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
            {"value": "dog"}
        ]
    },
    {
        "name": "energy",
        "value": "play fetch with",
        "ERCode": "ER_SUCCESS_MATCH",
        "ERValues": [
            {"value": "high"},
        ]
    },
    {
        "name": "size",
        "value": "mini",
        "ERCode": "ER_SUCCESS_MATCH",
        "ERValues": [
            {"value": "small"},
            {"value": "tiny"}
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
            PersoIntent: Helper.httpsGet(Helper.buildHttpGetOptions(base_url, '/dienstleistung/120703'))
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
//http://newsreel-edu.aot.tu-berlin.de/solr/smalltalk/select?q=willst&wt=json&indent=true