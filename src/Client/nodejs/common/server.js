var querystring = require('querystring');
var http = require("http");
var request = require('request');
var config = require('../config');

module.exports = {
    apiCall: function(endpoint, method, data, result) {
        var req = null;

        if (method === "GET") {
            var query = "";
            if (typeof data === "object")
                endpoint += '?' + querystring.stringify(data);
            else if (typeof data === "string" || typeof data === "number")
                endpoint += '/' + data;

            req = request.get({
                url: config.endPoint.host + endpoint,
                headers: {
                    'content-type': 'application/json'
                },
                json: true
            }, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    result(body, data);
                }
            });
            req.end();
        }

        if (method === "POST") {
            req = request.post({
                url: config.endPoint.host + endpoint,
                headers: {
                    'content-type': 'application/json'
                },
                json: data
            }, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    result(body);
                } else {
                    console.log(error);
                }
            });
        }
    },
    performRequest: function(endpoint, method, data, success) {
        var dataString = JSON.stringify(data);
        var headers = {};

        if (method == 'GET') {
            endpoint += '?' + querystring.stringify(data);
        } else {
            headers = {
                'Content-Type': 'application/json',
                'Content-Length': dataString.length
            };
        }
        var options = {
            host: "localhost",
            port: "30000",
            path: endpoint,
            method: method,
            headers: headers
        };

        var req = http.request(options, function(res) {
            res.setEncoding('utf-8');
            var responseString = '';

            res.on('data', function(data) {
                responseString += data;
            });

            res.on('end', function() {
                console.log(responseString);
                var responseObject = JSON.parse(responseString);
                success(responseObject);
            });
        });

        req.write(dataString);
        req.end();
    }
}