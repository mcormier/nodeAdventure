#!/bin/env node

var parser  = require('./command_parser.js');
var http = require('./http_server.js');
var app = http.server();

var io  = require('socket.io')(app);

var storyManager = require("./storyManager");
console.log("Stories loaded " + storyManager.stories() );

var session_cnt = 0;

io.on('connection', function (socket) {

  session_cnt = session_cnt + 1;
  var sess_id = session_cnt;
  console.log(sess_id + " Establishing new session     " + new Date() );

  var storyName = null;
  var story = null;

  function startStory() {
    story = storyManager.readStory(storyName);
    console.log(sess_id + " Client started story: " + storyName + "    " + new Date() );
  }

  function processError(e) {

    if (e.name == "GameOver" ) {
      console.log(sess_id + " Uh oh. Game Over!!     " + new Date() );
      startStory();
      socket.emit('displayMessage', e.message + "  \n \n ** Game over. ** " );
      return;
    } 

    if (e.name == "StartOver" ) {
      startStory();
      socket.emit('displayMessage', "Game reset." );
      return;
    } 

    console.log(sess_id + " Error occurred: " + e + "    " + new Date() )
    socket.emit('errorMsg', e.message );
    
 
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
      console.log(sess_id + " Can't send a command if no story chosen " + new Date() );
      socket.emit('errorMsg', 'ERROR - need to choose the story first. ' );
      socket.emit('errorMsg', 'Available stories ' + storyManager.stories() );
      return;
    }

    console.log( sess_id + " user input ***" + request + "***   " + new Date());

    command = parser.parse_command(request, story.command_synonyms() ); 

    try {
      var response = story.process_command(command);
      if ( response != null ) {
        socket.emit('displayMessage', response );
      } else {
        socket.emit('display', story.default_context() );
      }
    } catch (e) {
      processError(e);
    }
  });



});


