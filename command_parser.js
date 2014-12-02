#!/bin/env node

function string_starts_with(str, searchfor) {
  return str.indexOf(searchfor) === 0;
}

// Request is the full command sent by the user. I.E. OPEN DOOR
//
// SynonymMap(optional) is a map  of target synonyms that can be used for subsitution
// For example if you want USE PACK OF CIGARETTES to work like USE CIGARETTE PACK
// then  pass in the following map: 
//
// { "pack of cigarettes": "cigarette pack"}
//
function parse_command( request, synonymMap ) {
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

   // Remap target synonyms.  PACK OF CIGARETTES -> CIGARETTE PACK
   if (synonymMap != undefined ) {
     for (var key in synonymMap ) {
       if ( key.toLowerCase() == command.target ) {
         command.target = synonymMap[key]; 
       }
     }
   }

  } else {
    command.target = "";
  }

  return command
}

exports.parse_command = parse_command;

