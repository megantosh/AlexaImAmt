const Helper = require("./helper.js");
// //WARNING: appending 'http', 'https' breaks the URL object
const base_solr_url = 'newsreel-edu.aot.tu-berlin.de/solr/';
const base_web_url = 'service.berlin.de';
const invocationName = "Berlin";

module.exports = {


    //do not use "Leider ist etwas schief gelaufen" - reserved for wifi drops
    //Phoneme: pɪˈkɑːn
//****************************************************************
// Defaults
//****************************************************************

    'en':
        {
            INTRO_GREETING_TEXT: [
                'Welcome to Berlin. Can I help you with a public service?',
                'I can help you with a few public services around Berlin.',
                "Let's get you up and running in Berlin"
            ],
            INTRO_HELP_TEXT: [
                //"You can try: 'alexa, until when is Standesamt Friedrichshain-Kreuzberg open today'" +
                "Try asking me how to get your visa extended",
                "You can try asking me something like: 'How can I transfer my license to a german one' ",
                "I offer help on public service matters. But I must say I am more fluent in German." +
                "How about you try asking me about visa matters?"
            ],
            INTRO_UNHANDLED_TEXT: ["Sorry, I didn't get that. You can try: 'alexa, how do I transfer my driving license to a german one?'" +
            " or 'alexa, ask " + invocationName +
            //" when is the nearest city hall open today?'",
            "How do I get my visa extended.",
            "The skill did not quite understand what you wanted.  Do you want to try something else? "
            ]
            ,
            INTRO_STOP_TEXT: ['Goodbye', 'Have a good one!'],
            INTRO_CANCEL_TEXT: [
                "always at your service.",
                "I'll try to get better next time"
            ],
            INTRO_WIP_TEXT: "I'll find out about that and be ready for your question soon"
        },
    'de':
        {
            INTRO_GREETING_TEXT: [
                'Ich kann Ihnen mit den zahlreichen Dienstleistungen der Stadt Berlin helfen! ' +
                'worüber möchten Sie sich informieren?',
                //'Über welche Dienstleistung möchtest du dich informieren?',
                //'Möchtest Du dich über Öffnungszeiten oder eine Dienstleistung informieren?',
                'Willkommen in dem Hauptstadtportal. Was kann ich für Sie tun?'
            ],
            INTRO_HELP_TEXT: ["Sie können mich nach einer Dienstleistung fragen, die Sie zum Beispiel im Bürgeramt" +
            " erledigen würden. Versuchen Sie mal 'Ich möchte einen Perso beantragen' oder 'Ich möchte eine Wohnung" +
            " anmelden. Am Besten in ganzen sätzen.",
            'Fragen Sie mich nach einem Ort oder einer Postleitzahl in Berlin und ich verrate Ihnen, wo das ist'
            ],

            INTRO_UNHANDLED_TEXT: [
                "Sorry, das habe ich nicht verstanden. " +
                // "Probieren Sie mal: " +
                // "'alexa, wann hat das Bürgeramt Venus auf?'" +
                // " oder 'Alexa, frag Berlin D. E. wann hat das Bürgeramt in der Nähe auf heute'.'",
                'Pardon, das habe ich nicht richtig mitbekommen.'
            ],
            INTRO_STOP_TEXT: ['Ciao','<say-as interpret-as=\'interjection\'>tschö</say-as>','Schönen Tag Ihnen!', "Wiederseh'n!"],
            INTRO_CANCEL_TEXT_START: ["Haben Sie sonst noch nen Wunsch?", "Weitere Fragen?",
                "sonst noch <phoneme alphabet='ipa'  ph='n'>n</phoneme> Wunsch?"],
            INTRO_CANCEL_TEXT_END : ["Ansonsten verdrücke ich mich jetzt. ","Wenn nicht, dann sage ich mal bis" +
            " demnächst" , "Sonst trete ich nun aus dem Amt zurück"],
            SMALLTALK_BAUJAHR: ["Mein Baujahr? Wenn man mich erst zu ende gebaut hat, dann können wir darüber reden.",
            "Lassen wir die Fragen Baujahr beiseite. Soweit ich Sie über <emphasis level=\'moderate\'> Ihren" +
            " </emphasis> frage, jault die ganze Stadt von Datenschutz und so."],
            INTRO_WIP_TEXT: [
                //TODO - change before submission
                'Skill wird gerade entwickelt.',
                'das berücksichtige ich gerne beim nächsten Milestone',
                'ich mag es, wie Sie mich ausfragen. Sie sollten eine Karriere im Usability Bereich in Erwägung ziehen.',
                'ich werde zwar von einem mega entwickelt, aber leider geht das nicht mega schnell'
            ],
            BEFORE_ENDING_SESSION_TEXT: [
                'kann ich sonst behilflich sein?',
                'sonst noch ein Wunsch?'
            ]
        }



//TODO set default values - these are still from petmatch
// This data is for testing purposes.
// When isTestingWithSimulator is set to true
// The slots will be auto loaded with this default data.
// Set isTestingWithSimulator to false to disable to default data
// defaultData : [
//     {
//         "name": "pet",
//         "value": "pooch",
//         "ERCode": "ER_SUCCESS_MATCH",
//         "ERValues": [
//             {"value": "dog"}
//         ]
//     },
//     {
//         "name": "energy",
//         "value": "play fetch with",
//         "ERCode": "ER_SUCCESS_MATCH",
//         "ERValues": [
//             {"value": "high"},
//         ]
//     },
//     {
//         "name": "size",
//         "value": "mini",
//         "ERCode": "ER_SUCCESS_MATCH",
//         "ERValues": [
//             {"value": "small"},
//             {"value": "tiny"}
//         ]
//     },
//     {
//         "name": "temperament",
//         "value": "guard",
//         "ERCode": "ER_SUCCESS_NO_MATCH",
//     },
// ];


//****************************************************************
// Intent Maps
//****************************************************************


// Dienstleistung_IntentSpokenStrings : {
//     'de':
//         {
//             //When less parameters are sent to request(options), it will resolve the default values.
//             //TODO dynamic url resloution - routing
//             PersoIntent: Helper.httpsGet(Helper.buildHttpGetOptions(base_url, '/dienstleistung/120703'))
//             //PersoIntent: Helper.httpsGet('https://' + base_url + '/dienstleistung/120703/')
//
//             // TODO: lambda solr server beta3 andreas, dont forget to set the timeout in ask console
//             // or Lambda frontend for a high time otherwise u might never get an answer
//
//         },
//     'en':
//         {
//             //TODO
//         }
// }


//Oskar's suggestion
//export default defaultData;


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


};