#!/bin/env node

//console.log(process.env);


var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
if (typeof ipaddress === "undefined") {
   console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
  ipaddress = "127.0.0.1";
};
 
var http = require('http');

var app = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(port, ipaddress);

var io  = require('socket.io')(app);

io.on('connection', function (socket) {
  //io.emit('this', { will: 'be received by everyone'});

  socket.on('command', function(msg) {
    console.log("Recieved: " + msg );


    socket.emit('display text', 'Processing...');

  });



});


