var schedule = require('node-schedule');

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth();
var yyyy = today.getFullYear();

var date = new Date(yyyy, mm, dd, 1, 16, 30);

var j = schedule.scheduleJob(date, function(){
    console.log('The world is going to end today.');
    j.cancel();
});
