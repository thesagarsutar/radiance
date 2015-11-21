// var tesseract = require('node-tesseract');
//
//
// tesseract.process('out.png', function(err, text) {
//     if(err) {
//         console.error(err);
//     } else {
//         console.log(text);
//     }
// });

var dv = require('dv');
var fs = require('fs');
var image = new dv.Image('png', fs.readFileSync('./out.png'));
var tesseract = new dv.Tesseract('eng', image);
console.log(tesseract.findText('plain'));
