var parsed = require('./stories.json');

var storyList = [];
var storyGenerators = [];
for (var i = 0; i < parsed.stories.length; i++ ) {
    var storyLoader =  require(parsed.stories[i].file);
    console.log("Parsed " + parsed.stories[i].file );
    storyList.push(parsed.stories[i].title);
    storyGenerators.push(storyLoader);
}

function stories() {
  return storyList;
}

function storyExists(storyName) {
   if ( storyList.indexOf(storyName) == -1) { return false; }
   return true;
}


function readStory(storyName) {
  var index = storyList.indexOf(storyName); 
  var generator = storyGenerators[index];
  return generator.create();  
}

exports.stories = stories;
exports.storyExists = storyExists;
exports.readStory = readStory;
