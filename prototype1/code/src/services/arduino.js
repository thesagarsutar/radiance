var serial = require( "serialport" );
var SerialPort = serial.SerialPort;

// Replace with the device name in your machine.
var portName = "/dev/ttyACM1";

var sp = new SerialPort( portName, {
    baudrate: 9600
} );

module.exports = {

    init:function ( socket ) {

        /* When we get a new line from the arduino, send it to the browser via this socket */
        sp.on("open", function () {
          console.log('open');
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

};
