#!/bin/env node

function string_starts_with(str, searchfor) {
  return str.indexOf(searchfor) === 0;
}

function parse_command( request ) {
  var command = {};
  var normalized = request.toLowerCase();
  var words = normalized.split(' ');

  command.verb = words[0];
  if ( words.length > 1 ) {
    var start_target = normalized.indexOf(' ');
    command.target = normalized.substring(start_target+1);
   
    // Remove 'at ' to support look at door 
    if ( string_starts_with(command.target, 'at ') ) {
      command.target = normalized.substring(start_target+4);
    }

  } else {
    command.target = "";
  }

  return command
}

exports.parse_command = parse_command;

