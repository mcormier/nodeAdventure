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

io.on('connection', function (socket) {

  var storyChosen = false;
  console.log("TODO - what story are you connecting to?");

  socket.emit('stories', "catss|blah");

  socket.username = "testing";


  socket.on('command', function(msg) {
    console.log("Recieved: " + msg );

    if (storyChosen == false) {
      socket.emit('display text', 'ERROR - need to choose the story first. ' );
      return;
    }
    socket.emit('display text', 'Processing...' );

  });



});


