// what Alexa would say. phrases or complete sentences
// use '?' to read a question
// this.t = 'GREETINGS' to read the string properties
// preferred method for multilingual skill


exports.spokenStrings = {
    'en':
        {
            GREETING_TEXT: [
                'you seem like a foreigner to me. How long have you been in Berlin for you no to speak to me in German?',
                'Ey, wir sind in Deutschland.. Speak german with me please!'
            ],
            HELP_TEXT: "You can try: 'alexa, until when is Standesamt Friedrichshain-Kreuzberg open today'" +
            "or 'alexa, ask hello world my name is awesome Aaron'",
            UNHANDLED_TEXT: "Sorry, I didn't get that. You can try: 'alexa, how do I transfer my driving license to a german one?'" +
            " or 'alexa, ask Berlin D. E. when is the nearest city hall open today?'",
            STOP_TEXT: [
                "always at your service.",
                "I'll try to get better next time"
            ],
            CANCEL_TEXT: 'OK, Bye'
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
            CANCEL_TEXT: 'ich bin weg'
        }
}

//each card uses two variables. remember to reference them in the card by index
exports.cardStrings = {
    'de':
        {
            GREETING_TEXT: [
                'Willkommen beim virtuellen Service-Assistent der Stadt Berlin',
                'Disclaimer: Beta Version - This skill is in no way affiliated with Berlin.de website' + ' - Alle Angaben ohne Gewähr'
            ]
        },

    'en':
        {}
}
