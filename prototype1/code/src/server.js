
var fs = require('fs');
var path = require('path');
var gm = require('gm');
var mime = require('mime');
var Caman = require('caman').Caman;
// var tesseract = require('node-tesseract');
var dv = require('dv');

var schedule = require('node-schedule');

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth();
var yyyy = today.getFullYear();

process.on('SIGINT', function() {
  console.log('Naughty SIGINT-handler');
});
process.on('exit', function () {
  console.log('exit');
});
console.log('PID: ', process.pid);

// var express = require('express');
//
// var options = {
//     key: fs.readFileSync('/usr/local/apache/conf/ssl.key'),
//     cert: fs.readFileSync('/usr/local/apache/conf/ssl.crt'),
//     requestCert: false,
//     rejectUnauthorized: false
// };
//
// // Create a service (the app object is just a callback).
// var app = express();

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
}).listen(7828, function() {
  console.log('server is running at http://localhost:7828');
});

// var server = require('https').createServer(options, app).listen(7573, function(){
//     console.log("ssl server started at https://localhost:7573");
// });


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

      Caman("image.png", function () {
        this.sepia(0);
        this.exposure(60);
        this.greyscale();
        this.noise(0);
        this.brightness(10);
        this.contrast(0);
        this.gamma(5);
        this.sharpen(1);
        // this.curves('rgb', [0, 0], [100, 120], [180, 240], [255, 255]);
        this.render(function () {
          console.log('file saved');
          this.save("./out.png");
          // this.canvas.toBuffer();
          var imageBuffer = this.canvas.toBuffer().toString('base64');
          //console.log( imageBuffer );
          socket.emit( "onImageData1", "data:image/png;base64," + imageBuffer );

          setTimeout(function() {
            var image = new dv.Image('png', new Buffer(imageBuffer, 'base64')); // Ta-da);
            var tesseract = new dv.Tesseract('eng', image);
            var digitalizedData = tesseract.findText('plain');
            console.log(digitalizedData);
            socket.emit( "ocr", digitalizedData );
            var lines = digitalizedData.split("\n");
            if(lines.length > 2) {
              var time = lines[0].replace(/[-#+~*_:]/g, '.').replace(/[^0-9.aApPmM]/g,'').replace(/(^\s*,)|(,\s*$)/g, "");
                  time = time.replace(/[.]/, ":");
              var task = lines[1].replace(/\+/g,'t');
              console.log("------------------");
              console.log("time: ", time);
              console.log("message: ", task);
              console.log("------------------");
              var jsonData = [
                {
                  "time": time.toUpperCase(),
                  "task": task
                }
              ]
              socket.emit( "ocrJSON", JSON.stringify(jsonData) );
              var hours = Number(time.match(/^(\d+)/) ? time.match(/^(\d+)/)[1]: 0);
              var minutes = Number(time.match(/:(\d+)/) ? time.match(/:(\d+)/)[1] : 0);
              var AMPM = time.match(/[A-Z]+/g) ? time.match(/[A-Z]+/g)[0] : AM;
              console.log(hours, minutes, AMPM);
              console.log("----------");
              if(AMPM == "PM" && hours<12) hours = hours+12;
              if(AMPM == "AM" && hours==12) hours = hours-12;
              var sHours = hours.toString();
              var sMinutes = minutes.toString();
              if(hours<10) sHours = "0" + sHours;
              if(minutes<10) sMinutes = "0" + sMinutes;
              // console.log(sHours + ":" + sMinutes);
              var scheduleDate = new Date(yyyy, mm, dd, sHours, sMinutes, 0);
              require('./services/arduino.js').send(1);
              var j = schedule.scheduleJob(scheduleDate, function(){
                console.log("Arduino called");
                j.cancel();
              });
            }
          }, 2000);
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



process.on('SIGINT', function() {
  console.log('Nice SIGINT-handler');
  listeners = process.listeners('SIGINT');
  for (var i = 0; i < listeners.length; i++) {
    console.log(listeners[i].toString());
  }

  process.exit();
});
