var tesseract = require('node-tesseract');

// Recognize text of any language in any format
tesseract.process('/home/thesagarsutar/Pictures/Webcam/' + '2015-10-30-215910.jpg',function(err, text) {
    if(err) {
        console.error(err);
    } else {
        console.log(text);
    }
});

// Recognize German text in a single uniform block of text and set the binary path

var options = {
    l: 'eng',
    psm: 10,
    binary: '/usr/local/bin/tesseract'
};

tesseract.process('/home/thesagarsutar/Pictures/Webcam/' + '2015-10-30-215910.jpg', options, function(err, text) {
    if(err) {
        console.error(err);
    } else {
        console.log(text);
    }
});
