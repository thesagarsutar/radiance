window.addEventListener("DOMContentLoaded", function(){

  var canvas = document.getElementById("canvas"),
      context = canvas.getContext("2d"),
      video = document.getElementById("video")
      videoObj = {"video" : true},
      errCallBack = function(error) {
        console.log("Video capture error - ", error.code);
      };

  //get video listener

  var sendImage = function() {
    var dataURL = canvas.toDataURL("image/jpg");
    //console.log(dataURL);
    socket.emit('onImageData', dataURL);
  }

  if (navigator.getUserMedia) {
    navigator.getUserMedia(videoObj, function(stream){
      video.src = stream;
      video.play();
    }, errCallBack);
  } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
		navigator.webkitGetUserMedia(videoObj, function(stream){
			video.src = window.webkitURL.createObjectURL(stream);
			video.play();
		}, errCallBack);
	}
	else if(navigator.mozGetUserMedia) { // Firefox-prefixed
		navigator.mozGetUserMedia(videoObj, function(stream){
			video.src = window.URL.createObjectURL(stream);
			video.play();
		}, errCallBack);
	}

  document.getElementById("snap").addEventListener("click", function() {
	   context.drawImage(video, 0, 0, 640, 480);
     var image = new Image();
     image.id = "captured-image";
     image.src = canvas.toDataURL("image/png");
     image.onload = sendImage();
     document.getElementById('captured-image').remove();
     document.getElementById('captured-image-wrapper').appendChild(image);
  })


  $("#send-image-data").click(function() {
    sendImage();
  });

}, false);

var socket = io('http://localhost:7828/');
socket.on('connect', function(){});

socket.on('message', function(data){
  console.log(data);
  //var clickPhoto = isPressed
  if(data.trim() == "1") { //if button is pressed
    $("#snap").click();
    $("#processed-image-wrapper .loader-wrapper").show();
  }
});

socket.on('onImageData1', function(data){
  $("#processed-image-wrapper .loader-wrapper").hide();
  //console.log(data);
  var image = new Image();
  image.id="processed-image";
  image.src = data;
  document.getElementById('processed-image').remove();
  document.getElementById('processed-image-wrapper').appendChild(image);
  $("#ocr-wrapper .loader-wrapper").show();
});

socket.on('ocr', function(data) {
  console.log("OCR data", data);
  document.getElementById('ocr-data').value = data;
  $("#ocr-wrapper .loader-wrapper").hide();
});

socket.on('ocrJSON', function(data) {
  console.log("OCR JSONdata", data);
  var ocrObj = JSON.parse(data);
  $("#time").text(ocrObj[0].time);
  $("#task").text(ocrObj[0].task);
});

socket.on('disconnect', function(){});
