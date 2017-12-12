var express = require('express'),
app = express(),
https = require('https'),
request = require('request'),
bodyParser = require('body-parser'),
PROXY_PORT = 8080,
HTTPS_POST = 443,
API_ENDPOINT = '/v1',
CONTENT_TYPE = 'application/json',
HTTPS_HOST = 'xforge.xboxlive.com',
HTTP_METHOD = 'POST';


app.listen(PROXY_PORT);
console.log('EXPRESS.JS SERVER LISTENING ON PORT:', PROXY_PORT)

app.use(bodyParser.json());

app.use(API_ENDPOINT, function(req, res, next) {
var options = {
    hostname: HTTPS_HOST,
    port: HTTPS_POST,
    path: API_ENDPOINT + req.url,
    method: HTTP_METHOD,
    headers: {
        'Content-Type': CONTENT_TYPE
    }
},
body = '';

res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

console.log(new Date(), ' -- Rquest Received:', req.body, req.url);

var requ = https.request(options, function(https_res) {
    console.log(new Date(), 'statusCode: ', https_res.statusCode);
    console.log(new Date(), 'headers: ', https_res.headers);

    https_res.on('data', function(d) {
        body += d;
    });

    https_res.on('end', function() {
        res.send(body);
        console.log(new Date(), 'Sent request: ', req.body);
        next();
    });

});

requ.write(JSON.stringify(req.body));
requ.end();
});

/*
const express = require('express')
const app = express()
const expressproxy = require('express-http-proxy')
const request = require('request-promise')

var bodyParser = require('body-parser')
// parse various different custom JSON types as JSON
app.use(bodyParser.json())

const xforgeUrl = "xforge.xboxlive.com:443/";

// app.use('/v1', 
//   expressproxy(xforgeUrl, {
//     proxyReqPathResolver: function(req) {
//       return require('url').parse(req.url).path;
//     }
//   })
// );


const responseFnc = (req, originalRes) => {
  console.log('hit!')
  if (req.method == "OPTIONS") {
    originalRes.send({
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": req.headers["Access-Control-Request-Method"],
        "Access-Control-Allow-Headers": req.headers["Access-Control-Request-Headers"],
      }
    });
  }
  else {
   
    
    let proxyHeaders = req.headers;
    proxyHeaders['Cache-Control'] = 'public';
    proxyHeaders.Host = "xforge.xboxlive.com";
    proxyHeaders['Keep-Alive'] = 'timeout=5';

    let proxyBody = req.body;
    originalRes.end();

    request(
      xforgeUrl + req.path,
      {
        method: req.method,
        body: proxyBody,
        headers: proxyHeaders,
        json: true
      }
    ).then((body) => {
      originalRes.send(body);
    }).catch(function (err) {
      console.log('http error: ' + err);
    });
    
  }
};

app.get('*', responseFnc);
app.post('*', responseFnc);
app.put('*', responseFnc);
app.options('*', responseFnc);


app.listen(8080, (req) => {
  console.log('Example app listening on port 3000!')
})
*/
