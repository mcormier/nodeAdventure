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
  var normalized = request.toLowerCase();
  var words = normalized.split(' ');

  command.verb = words[0];
  if ( words.length > 1 ) {
    var start_target = normalized.indexOf(' ');
    command.target = normalized.substring(start_target+1);
  } else {
    command.target = "";
  }

  return command
}


io.on('connection', function (socket) {

  var storyName = null;
  var story = null;
  console.log("New connection from " + socket.request.connection.remoteAddress );

  function startStory() {
    story = storyManager.readStory(storyName);
    console.log("Client started story: " + storyName);
  }

  // Give the client a list of stories to choose from
  socket.emit('stories', storyManager.stories() );

  // The client  chose a story
  socket.on('chooseStory', function(name) {

    if (storyManager.storyExists(name)) {
      storyName = name; 
      startStory();
      socket.emit('display', story.default_context() );
    }
  });

  socket.on('command', function(request) {

    if (storyName == null) {
      console.log("Can't send a command if no story chosen");
      socket.emit('errorMsg', 'ERROR - need to choose the story first. ' );
      socket.emit('errorMsg', 'Available stories ' + storyManager.stories() );
      return;
    }

    command = parse_command(request); 

    try {
      var response = story.process_command(command);
      if ( response != null ) {
        socket.emit('displayMessage', response );
      } else {
        socket.emit('display', story.default_context() );
      }
    } catch (e) {
      if (e.name == "StartOver" ) {
        startStory();
        socket.emit('displayMessage', "Game reset." );
      } else {
        console.log(e.stack)
        socket.emit('errorMsg', e.message );
      }
    }
  });



});


