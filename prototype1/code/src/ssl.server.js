var https = require('https');
var fs = require('fs');
var express = require('express');

var options = {
    key: fs.readFileSync('/usr/local/apache/conf/ssl.key'),
    cert: fs.readFileSync('/usr/local/apache/conf/ssl.crt'),
    requestCert: false,
    rejectUnauthorized: false
};


var app = express();

var server = https.createServer(options, app).listen(3000, function(){
    console.log("server started at port 3000");
});
