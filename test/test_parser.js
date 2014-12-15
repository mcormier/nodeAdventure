#!/bin/env node

// A simple test file.  No assertions, just look at the output from
// node test_parser.js and make sure it matches up.

var parser  = require('../command_parser.js');


console.log( parser.parse_command("LOOK DOOR") );
console.log( parser.parse_command("LOOK AT DOOR") ); // At should be removed
console.log( parser.parse_command("TALK TO BARTENDER") ); // To should be removed
console.log( parser.parse_command("OPEN DOOR") );
console.log( parser.parse_command("GO NORTH") );
console.log( parser.parse_command("TAKE CIGARETTE PACK") );
console.log( parser.parse_command("TAKE PACK OF CIGARETTES") );

// Test synonym parsing.  Pack of cigarettes should bet replaced with cigarette pack
console.log( parser.parse_command("TAKE PACK OF CIGARETTES", 
             { "pack of cigarettes": "cigarette pack"} ) );
