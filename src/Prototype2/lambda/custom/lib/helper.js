//use after-load for pages with JavaScript, simulates browser behaviour
const https = require("https");
//alternatively, use fetch module in case of cookies handling, redirect etc
//const fetchUrl = require("fetch").fetchUrl;



//choose one Utterance for Alexa to respond with. There are many defined in strings.js
exports.getRandomResponseUtterance = function(inputArray) {
    const randomUtterance =  Math.floor(Math.random() * inputArray.length);
    return inputArray[randomUtterance];
}



// ***********************************
// ** Helper functions from
// ** www.github.com/alexa/alexa-cookbook
// ** These should not need to be edited
// ***********************************

// ***********************************
// Route to Intent
// ***********************************

// after doing the logic in new session,
// route to the proper intent

function routeToIntent() {

    switch (this.event.request.type) {
        case 'IntentRequest':
            this.emit(this.event.request.intent.name);
            break;
        case 'LaunchRequest':
            this.emit('LaunchRequest');
            break;
        default:
            this.emit('LaunchRequest');
    }
}

// ***********************************
// Webservice Calls
// ***********************************

// make an https get request call resolve upon completion and reject if there's an error using a promise.
exports.httpsGet = function httpGet(options){
    return new Promise(function(resolve, reject) {
        let request = https.request(options, response => {
            console.log(https.request.toString());
            response.setEncoding('utf8');
            let returnData = "";

            if (response.statusCode < 200 || response.statusCode >= 300) {
                // we must return in this case
                // otherwise reject runs on the next tick and we'll get an error
                // when res.on('end') tries to parse the HTML/JSON content.
                return reject(new Error(`${response.statusCode}: ${response.req.getHeader('host')} ${response.req.path}`));
            }

            response.on('data', chunk => {
                returnData = returnData + chunk;
            });

            response.on('end', () => {
                // we have now received the raw return data in the returnData variable.
                // Preview: is it a string?
                console.log(returnData);
                console.log(JSON.stringify(returnData))
                // we may need to parse through it to extract the needed data


                let response = returnData;
                //TODO get the appropriate part from the website / json file
                //TODO maybe pass it on for parsing, still dunno, depending on Solr endpoint
                //let response = returnData.getElementsByClassName("body dienstleistung")[1];
                console.log(response);
                // let responsejson = JSON.parse(returnData);
                // console.log(responsejson);

                // this will execute whatever the block of code that was passed to
                // httpGet and pass the JSON `response` to it.
                resolve(response);
            });

            response.on('error', error => {
                reject(error);
            });
        });
        request.end();
    });
}

// Creates the options object for an HTTPs GET Request
// Returns an object.

exports.buildHttpGetOptions = function buildHttpGetOptions(host, path, port){ //, params) {
    // if (params == null){
    let options = {
        hostname: host,
        path: path,
        port: port, // when a null is passedn, uses by default port 443 for HTTPSecure
        method: 'GET'
    };
    // } else {
    //     let options = {
    //         hostname: host,
    //         path: path + buildHttpQueryString(params),
    //         port: port, // when a null is passedn, uses by default port 443 for HTTPSecure
    //         method: 'GET'
    //     };
    // }

    console.log("URL parsed: " + JSON.stringify(options));
    return options;
}


//TODO the idea is to make this map to ssds and get the dienstleistungsnummer etc.
// Given a list of parameters it builds the query string for a request.
// Returns URI encoded string of parameters.
exports.buildHttpQueryString = function buildHttpQueryString(params) {
    // let paramList = '';
    // params.forEach( (paramGroup, index) => {
    //     paramList += `${ index == 0 ? '?' : '&'}${encodeURIComponent(paramGroup[0])}=${encodeURIComponent(paramGroup[1])}`;
    // });
    return paramList;

}





// TODO another simple HTTP get. remove in case redundant
// {
//     http.get({
//         host: BASE_URL,
//         path: '/email'
//     }, function (res) {
//         // explicitly treat incoming data as utf8 (avoids issues with multi-byte chars)
//         res.setEncoding('utf8');
//
//         // incrementally capture the incoming response body
//         var body = '';
//         res.on('data', function (d) {
//             body += d;
//         });
//
//         // do whatever we want with the response once it's done
//         res.on('end', function () {
//             try {
//                 var parsed = JSON.parse(body);
//             } catch (err) {
//                 console.error('Unable to parse response as JSON', err);
//                 return cb(err);
//             }
//
//             // pass the relevant data back to the callback
//             cb(null, {
//                 email: parsed.email,
//                 password: parsed.pass
//             });
//         });
//     }).on('error', function (err) {
//         // handle errors with the request itself
//         console.error('Error with the request:', err.message);
//         cb(err);
//     });
// }