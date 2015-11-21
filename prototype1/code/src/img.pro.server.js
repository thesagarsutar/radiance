
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


// node-canamJs
Caman("image.png", function () {
  this.sepia(0);
  this.exposure(57);
  this.greyscale();
  this.noise(0);
  this.brightness(10);
  this.contrast(0);
  this.gamma(2);
  this.sharpen(100);
   // this.curves('rgb', [0, 0], [100, 120], [180, 240], [255, 255]);
  this.render(function () {
  	console.log('file saved');
    this.save("./out.png");
  });
});


//node-lwip
// obtain an image object:
// require('lwip').open('image.png', function(err, image){

//   // check err...
//   // define a batch of manipulations and save to disk as JPEG:
//   image.batch()
//     .sharpen(100)
//     .saturate(-100)
//     .lighten(1.2)
//     .writeFile('output.jpg', function(err){
//       // check err...
//       // done.
//     });

// });


//node-jimp
// var Jimp = require("jimp");
// Jimp.read("image.png").then(function (image) {
//                 // resize
//     image.greyscale()                 // set greyscale
//          .brightness(0.15)
//          .background(0xFFFFFF)
//          .color([
//     { apply: 'lighten', params: [ 20 ] },
//     { apply: 'brighten', params: [ 10 ] },
//     { apply: 'greyscale', params: [ 20 ] },
//     { apply: 'xor', params: [ '#000' ] }
// ])
//          .write("output.jpg"); // save
//     console.info('image created');
// }).catch(function (err) {
//     console.error(err);
// });