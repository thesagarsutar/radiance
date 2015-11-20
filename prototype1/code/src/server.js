
var fs = require('fs');
var path = require('path');
var gm = require('gm');
var mime = require('mime');
var Caman = require('caman').Caman;

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

    socket.on('onImageData', function(data) {
       var decodedImg = decodeBase64Image(data);
       var imageBuffer = decodedImg.data;
       var type = decodedImg.type;
       var extension = mime.extension(type);
       var fileName =  "image." + extension;
       try {
           fs.writeFileSync(fileName, imageBuffer, 'utf8');
           console.log("--- image created successfully ---");
          //  var buf = require('fs').readFileSync('image.png');
          //  gm(buf, 'image.png')
          //   .contrast(50)
          //   .autoOrient()
          //   .sharpen(5, 2)
          //   .write('out.jpg', function (err) {
          //     if (err) {
          //       console.log("error while image creation", err);
          //     }else {
          //       console.log('Created an image from a Buffer!');
          //     }
          //   });
          Caman("image.png", function () {
            // this.brightness(40);
            // this.contrast(10);
            this.brightness(10);
            this.contrast(30);
            this.sepia(60);
            this.saturation(-30);
            this.exposure(100);
            //this.saturation(-100);
            this.render(function () {
              this.save("./out.png");
            });
          });
        }
       catch(err) {
          console.error(err)
       }
    });
} );


function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}
