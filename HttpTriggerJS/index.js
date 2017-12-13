const https = require('https'),
    HTTPS_POST = 443,
    CONTENT_TYPE = 'application/json',
    HTTPS_HOST = 'xforge.xboxlive.com';

function error(context, msg) {
    context.res = {
        status: 400,
        body: msg
    };
    context.done();
}

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log(req);

    if (req.method == "OPTIONS") {
        let allowedMethods = [req.method];
        let reqMethods = req.headers["access-control-request-method"];
        if (reqMethods) {
            allowedMethods.push(reqMethods);
        }

        let allowedHeaders = [];
        let reqHeaders = req.headers["access-control-request-headers"];
        if (reqHeaders) {
            allowedHeaders.push(reqHeaders);
        }

        context.res = {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": JSON.stringify(allowedMethods),
                "Access-Control-Allow-Headers": JSON.stringify(allowedHeaders),
                "Accept": "*",
                "Accept-Language": "*",
                "Accept-Encoding": "*",
                "Accept-Charset": "*",
            },
            status: 200,
            body: "my body..."
        };
        context.done();
    }
    else {
        if (!req.headers['xforge_endpoint']) {
            error("Please specify an 'xforge_endpoint' header");
            return;
        }
        var options = {
            hostname: HTTPS_HOST,
            port: HTTPS_POST,
            path: req.headers['xforge_endpoint'],
            method: req.method,
            headers: {
                'Content-Type': CONTENT_TYPE
            }
        };
        var body = '';

        context.log("Forwarded to: " + options.path);

        var requ = https.request(options, function (https_res) {
            context.log(new Date(), 'statusCode: ', https_res.statusCode);
            context.log(new Date(), 'headers: ', https_res.headers);

            https_res.on('data', function (d) {
                body += d;
            });

            https_res.on('end', function () {

                context.res = {
                    status: https_res.statusCode,
                    headers: {
                        'Content-Type': CONTENT_TYPE,
                    },
                    body: JSON.parse(body)
                };

                context.done();
            });

            https_res.on('error', function () {
                context.done();
            });

        });

        // write body if we have one
        if (req.body) {
            requ.write(JSON.stringify(req.body));
        }
        requ.end();
    }
};