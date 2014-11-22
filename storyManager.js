var parsed = require('./stories.json');

var storyList = [];
for (var i = 0; i < parsed.stories.length; i++ ) {
    storyList.push(parsed.stories[i].title);
}

function stories() {
  return storyList;
}

function storyExists(storyName) {
   if ( storyList.indexOf(storyName) == -1) { return false; }
   return true;
}


function readStory(storyName) {
  console.log("TODO - create a story object ..." );
  
}

exports.stories = stories;
exports.storyExists = storyExists;
exports.readStory = readStory;
