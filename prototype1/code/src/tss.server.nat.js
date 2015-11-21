var tesseract = require('tesseract_native');
var http = require('http');
var fs = require('fs');



var myOcr = new tesseract.OcrEio();

var bitmap = fs.readFileSync('./out.png');
var buffer = new Buffer(bitmap);

myOcr.ocr(buffer, function(err, result) {
    if(err) {
        console.log(err);
    } else {
        console.log(result);
    }
});

//
// var server = http.createServer(function(request, response)
// {
//     if(request.method === 'POST')
//     {
//         var totalSize = 0;
//         var bufferList = new Array();
//         var myOcr = new tesseract.OcrEio();
//
//         request.on('data', function(data) {
//             bufferList.push(data);
//             totalSize += data.length;
//             if (totalSize > 1e6) {
//                 console.log('Request body too large');
//                 request.connection.destroy();
//             }
//         });
//
//         request.on('end', function() {
//             var buffer = Buffer.concat(bufferList, totalSize);
//             myOcr.ocr(buffer, function(err, result) {
//                 if(err) {
//                     response.writeHead(500, {'Content-Type': 'text/plain'});
//                     response.end("Error " + err);
//                 } else {
//                     response.writeHead(200, {'Content-Type': 'text/plain'});
//                     response.end(result);
//                 }
//             });
//         });
//
//     } else {
//         request.connection.destroy();
//     }
// }).listen(process.argv[2]);
