#!/bin/env node

var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
if (typeof ipaddress === "undefined") {
  ipaddress = "127.0.0.1";
  console.warn('No OPENSHIFT_NODEJS_IP var, using ' + ipaddress);
};
 
var http = require('http');

var app = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('"If they can get you asking the wrong questions, they don\'t have to worry about answers."\n -- Thomas Pynchon, Gravity\'s Rainbow \n');
}).listen(port, ipaddress);

var io  = require('socket.io')(app);

var storyManager = require("./storyManager");
console.log("Stories loaded " + storyManager.stories() );


function parse_command( request ) {
  var command = {};
  var words = request.toLowerCase().split(' ');
  command.verb = words[0];
  if ( words.length > 1 ) {
    command.target = words[1];
  }

  return command
}


io.on('connection', function (socket) {

  var storyChosen = false;
  var story = null;

  // Give the client a list of stories to choose from
  socket.emit('stories', storyManager.stories() );

  // The client  chose a story
  socket.on('chooseStory', function(storyName) {

    if (storyManager.storyExists(storyName)) {
      story = storyManager.readStory(storyName);
      storyChosen = true;
      socket.emit('display', story.intro() );
      console.log("Client started story: " + storyName);
    }
  });

  socket.on('command', function(request) {

    if (storyChosen == false) {
      console.log("Can't send a command if no story chosen");
      socket.emit('errorMsg', 'ERROR - need to choose the story first. ' );
      socket.emit('errorMsg', 'Available stories ' + storyManager.stories() );
      return;
    }

    command = parse_command(request); 
    console.log("verb: " + command.verb );
    console.log("target: " + command.target );
    var response = story.process_command(command);

    socket.emit('errorMsg', response );

  });



});


