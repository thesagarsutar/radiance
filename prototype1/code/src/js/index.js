window.addEventListener("DOMContentLoaded", function(){

  var canvas = document.getElementById("canvas"),
      context = canvas.getContext("2d"),
      video = document.getElementById("video")
      videoObj = {"video" : true},
      errCallBack = function(error) {
        console.log("Video capture error - ", error.code);
      };

  //get video listener

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
	   context.drawImage(video, 0, 0, 560, 420);
  })

  $("#send-image-data").click(function() {
    var dataURL = canvas.toDataURL("image/jpg");
    console.log(dataURL);
    socket.emit('onImageData', dataURL);
  });

}, false);

var socket = io('http://localhost:7828/');
socket.on('connect', function(){});

socket.on('message', function(data){
  console.log(data);
  //var clickPhoto = isPressed
  if(data.trim() == "1") { //if button is pressed
    $("#snap").click();
  }
});



socket.on('disconnect', function(){});
