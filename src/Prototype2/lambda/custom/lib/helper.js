
//choose one Alexa Utterance of many defined in languageStrings

exports.getResponseUtterance = function(textArray) {
    const inputArray = textArray;
    const randomUtterance =  Math.floor(Math.random() * inputArray.length);
    var textOption = inputArray[randomUtterance];
    return textOption;
}