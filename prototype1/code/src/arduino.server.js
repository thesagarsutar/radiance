// var SerialPort = require("serialport").SerialPort;
// var serialport = new SerialPort("/dev/ttyACM1");
// serialport.on('open', function(){
//   console.log('Serial Port Opend');
//   serialport.on('data', function(data){
//       console.log(data);
//   });
// 	serialport.write('1', function(err, result){
// 			console.log("error", err);
// 			console.log("result", result);
// 	});
// })

var serial = require( "serialport" );
var SerialPort = serial.SerialPort;

// Replace with the device name in your machine.
var portName = "/dev/ttyACM0", sp, socket;
var input;

serial.list(function(err, ports) {
  ports.forEach(function(port){
    //console.log(port.comName + "---", port.pnpId + "---", port.manufacturer);
    if(port.manufacturer && port.manufacturer.indexOf("Arduino") >=0)
    {
        portName = port.comName;
        console.log(portName);
        sp = new SerialPort( portName, {
            baudrate: 9600
        } );
        openPort();
    }
  });
});

var openPort = function () {
  /* When we get a new line from the arduino, send it to the browser via this socket */
  if(sp) {
    sp.on("open", function () {
      console.log('Serial Port is Open');
      sp.on('data', function(data) {
        console.log('data received: ' + data);
      });
      // sp.write("1", function(err, results) {
      //   console.log('err ' + err);
      //   console.log('results ' + results);
      // });
    });
  }
}


process.stdin.resume();
process.stdin.setEncoding('utf8');
var util = require('util');

process.stdin.on('data', function (text) {

  console.log('received data:', util.inspect(text));
  sp.write("1", function(err, results) {
    console.log('err ' + err);
    console.log('results ' + results);
  });
  if (text === 'quit\n') {
    done();
  }
});

function done() {
  console.log('Now that process.stdin is paused, there is nothing more to do.');
  process.exit();
}
