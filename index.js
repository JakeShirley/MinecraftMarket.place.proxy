var express = require('express'),
  app = express(),
  https = require('https'),
  request = require('request'),
  bodyParser = require('body-parser'),
  PROXY_PORT = 8080,
  HTTPS_POST = 443,
  API_ENDPOINT = '/v1',
  CONTENT_TYPE = 'application/json',
  HTTPS_HOST = 'xforge.xboxlive.com';


app.listen(PROXY_PORT);
console.log('EXPRESS.JS SERVER LISTENING ON PORT:', PROXY_PORT)

app.use(bodyParser.json());

app.use(API_ENDPOINT, function (req, res, next) {
  var options = {
    hostname: HTTPS_HOST,
    port: HTTPS_POST,
    path: API_ENDPOINT + req.url,
    method: req.method,
    headers: {
      'Content-Type': CONTENT_TYPE
    }
  },
    body = '';

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  console.log(new Date(), ' -- Rquest Received:', req.body, req.url);

  var requ = https.request(options, function (https_res) {
    console.log(new Date(), 'statusCode: ', https_res.statusCode);
    console.log(new Date(), 'headers: ', https_res.headers);

    https_res.on('data', function (d) {
      body += d;
    });

    https_res.on('end', function () {
      res.status(https_res.statusCode);
      let contentType = https_res.headers['content-type'];
      res.setHeader('Content-Type', contentType);
      res.send(body);

      console.log(new Date(), 'Sent request: ', req.body);
      next();
    });
  });

  requ.write(JSON.stringify(req.body));
  requ.end();
});
