const https = require("https");
const url = require("url");
// require('ssl-root-cas').inject();

const de_Model = require('../../models/de-DE.json');


// const hamada= "http://newsreel-edu.aot.tu-berlin.de/solr/d115/select?q=personalausweis&wt=json&indent=true";

// getAstrosHttps(hamada, (err, data) =>{
//     // console.log(hamada.getHeader()); //error - iz not a func
//     console.log(data);
// });


// function getAstrosHttps(endpointUrl, callback) {
//     //http://api.open-notify.org/astros.json
//     //http://newsreel-edu.aot.tu-berlin.de/solr/d115/select?q=personalausweis&wt=json&indent=true
//
//     var options = //"https://newsreel-edu.aot.tu-berlin.de/solr/"
//         {
//         host: url.parse(endpointUrl).hostname,
//         port: url.parse(endpointUrl).port,
//         path: url.parse(endpointUrl).path,
//         // host: "newsreel-edu.aot.tu-berlin.de/solr/",
//         // port: 443,
//         // path: "d115/select?q=personalausweis&wt=json&indent=true",
//         // //open api for astraunauts
//         // host: 'api.open-notify.org',
//         // port: 80,
//         // path: '/astros.json',
//         method: 'GET',
//         rejectUnauthorized: false,
//         auth: "personal-assistent:AlexaAlexa0815."
//     };
//
//     console.log(url.parse(endpointUrl).hostname);
//     console.log(url.parse(endpointUrl).path);
//     console.log(url.parse(endpointUrl).port);
//
//     var req = https.request(options, res => {
//     // var req = https.request(options, res => {
//         console.log(`STATUS: ${res.statusCode}`);
//         console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
//         res.setEncoding('utf8');
//         var returnData = "";
//
//         res.on('data', chunk => {
//             returnData = returnData + chunk;
//         });
//
//         res.on('end', () => {
//             var result = JSON.parse(returnData);
//             console.log('No more data in response.');
//
//             return callback('ERRör', result);
//
//             // callback(result);
//         });
//         req.on('error', (e) => {
//             console.error(`problem with request: ${e.message}`);
//         });
//      });
//     req.end();
// }


//
//     var username = 'personal-assistent';
//     var password = 'AlexaAlexa0815.';
//     var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
// // new Buffer() is deprecated from v6
//
// // auth is: 'Basic VGVzdDoxMjM='
//
//     var header = {'Host': 'https://newsreel-edu.aot.tu-berlin.de/solr', 'Authorization': auth};
//     var request = client.request('GET', '/', header);


// var megaOptions(endpointUrl) = //"https://newsreel-edu.aot.tu-berlin.de/solr/"
//         {
//         host: url.parse(endpointUrl).hostname, 
//         port: url.parse(endpointUrl).port,
//         path: url.parse(endpointUrl).path,
//         // host: "newsreel-edu.aot.tu-berlin.de/solr/",
//         // port: 443,
//         // path: "d115/select?q=personalausweis&wt=json&indent=true",
//         // //open api for astraunauts
//         // host: 'api.open-notify.org',
//         // port: 80,
//         // path: '/astros.json',
//         method: 'GET',
//         rejectUnauthorized: false,
//         auth: "personal-assistent:AlexaAlexa0815."
//     };


// data = httpsGet(buildHttpGetOptions("select?q=personalausweis&wt=json&indent=true"));
//
// var outputSpeech = `There are currently ${data.response.length} astronauts in space. `;
// console.log(outputSpeech);
//
// function buildHttpGetOptions(params) {
//     let options = {
//         hostname: "newsreel-edu.aot.tu-berlin.de",
//         path: "/solr/d115/" + params, //buildQueryString(params),
//         // port: port,
//         method: 'GET',
//         rejectUnauthorized: false,
//         auth: "personal-assistent:AlexaAlexa0815."
//     };
//     return options;
// }
//
//
// function httpsGet(options){
//     return new Promise(function(resolve, reject) {
//         let request = https.request(options, response => {
//             response.setEncoding('utf8');
//             let returnData = "";
//
//             if (response.statusCode < 200 || response.statusCode >= 300) {
//                 // we must return in this case
//                 // otherwise reject runs on the next tick and we'll get an error
//                 // when res.on('end') tries to parse the JSON.
//                 return reject(new Error(`${response.statusCode}: ${response.req.getHeader('host')} ${response.req.path}`));
//             }
//
//             response.on('data', chunk => {
//                 returnData = returnData + chunk;
//             });
//
//             response.on('end', () => {
//                 // we have now received the raw return data in the returnData variable.
//                 // We can see it in the log output via:
//                 // console.log(JSON.stringify(returnData))
//                 // we may need to parse through it to extract the needed data
//
//                 let response = JSON.parse(returnData);
//                 // this will execute whatever the block of code that was passed to
//                 // httpGet and pass the JSON `response` to it.
//                 resolve(response);
//             });
//
//             response.on('error', error => {
//                 reject(error);
//             });
//         });
//         request.end();
//     });
// }

console.log(de_Model.interactionModel.languageModel.intents[1].name);