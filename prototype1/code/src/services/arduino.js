var serial = require( "serialport" );
var SerialPort = serial.SerialPort;

// Replace with the device name in your machine.
var portName = "/dev/ttyACM0", sp, socket;


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
        socket.emit( "message", data.toString() );
      });
      sp.write("ls\n", function(err, results) {
        console.log('err ' + err);
        console.log('results ' + results);
      });
    });
  }
}

function sendData(data) {
  console.log("Data send to arduino: ", data.toString());
  sp.write('1', function(err, results) {
    console.log('err ' + err);
    console.log('results ' + results);
  });
}

module.exports = {
  init: function (newSocket) {
    socket = newSocket;
  },
  send: function (data) {
    sendData(data)
  }
};
