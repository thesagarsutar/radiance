var util = require('util')

var exec = require('child_process').exec;

var child;

// executes `pwd`

child = exec("pwd", function (error, stdout, stderr) {

  util.print('stdout: ' + stdout);

  util.print('stderr: ' + stderr);

  if (error !== null) {

    console.log('exec error: ' + error);

  }

});

// or more concisely


function puts(error, stdout, stderr) { console.log(stdout) }

exec("v4l2-ctl -d 1 -c focus_auto=0", puts);
exec("v4l2-ctl -d 1 -c focus_absolute=1", puts);
