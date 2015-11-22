var nodehun = require('nodehun');
var fs = require('fs');
var affbuf = fs.readFileSync('/usr/share/myspell/dicts/'+'/en_GB.aff');
var dictbuf = fs.readFileSync('/usr/share/myspell/dicts/'+'/en_GB.dic');
var dict = new nodehun(affbuf,dictbuf);

dict.spellSuggestions('G0 to',function(err, correct, suggestions, origWord){
    console.log(err, correct, suggestions, origWord);
    // because "color" is a defined word in the US English dictionary
    // the output will be: null, true, [], 'color'
});

dict.spellSuggestions('INFOCIT‘f',function(err, correct, suggestions, origWord){
    console.log(err, correct, suggestions, origWord);
    // because "calor" is not a defined word in the US English dictionary
    // the output will be: null, false, [ 'carol','valor','color','cal or','cal-or','caloric','calorie'], 'calor'
});
