
var fs = require('fs');
var path = require('path');

var http = require('http').createServer(function (request, response) {
  console.log('starting request....');

  //set default file location
  var filePath = '.' + request.url;
  if(filePath == './') {
    filePath = './index.html';
  }

  var fileExt = path.extname(filePath),
      contentType = 'text/html';

  switch (fileExt) {
    case '.js':
        contentType = 'text/javascript';
        break;
    case '.css':
        contentType = 'text/css';
        break;
    case '.json':
        contentType = 'application/json';
        break;
    case '.png':
        contentType = 'image/png';
        break;
    case '.jpg':
        contentType = 'image/jpg';
        break;
    case '.wav':
        contentType = 'audio/wav';
        break;
  }

  fs.readFile(filePath, function(error, content) {
    if (error) {
        if(error.code == 'ENOENT'){
            fs.readFile('./404.html', function(error, content) {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            });
        }
        else {
            response.writeHead(500);
            response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            response.end();
        }
    }
    else {
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content, 'utf-8');
    }
  });
}).listen(7828);

console.log('server is running at http://localhost:7828');

var io = require('socket.io')(http);

io.on( "connection", function ( socket ) {
    // On a new Socket.io connection, load the data provider we want. For now, just Arduino.
    console.log("connection established with client ...");
    var $provider = require('./services/arduino.js').init(socket);
} );
