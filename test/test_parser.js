#!/bin/env node

// A simple test file.  No assertions, just look at the output from
// node test_parser.js and make sure it matches up.

var parser  = require('../command_parser.js');


console.log( parser.parse_command("LOOK DOOR") );
console.log( parser.parse_command("LOOK AT DOOR") );
console.log( parser.parse_command("OPEN DOOR") );
console.log( parser.parse_command("GO NORTH") );
