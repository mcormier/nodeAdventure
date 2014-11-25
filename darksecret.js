var common  = require('./commands.js');
var CMDS = common.commands();

// -------------------------------------------------------------------------
//  Items
// -------------------------------------------------------------------------
function Sign() { 
  return { "name": function () { return "sign"; },
           "verb_read": function () { return "Dark Secret Software Inc. Corporate Office. Go inside for contact information."; }
         }
}

// -------------------------------------------------------------------------
function ROOMS() {

  return  {
    "road": {
      "short": "Ouside a lovely home.",
      "long": "You are standing outside a lovely home in rural Nova Scotia",
      "items": [ Sign() ],
      "exits": ["porch", null, null, null]
    },
    "porch": {
      "short": "The front step.",
      "long": "You are on the front step of the house.",
      "items": [],
      "exits": [null, null, null, "road"]
    }

  };
}

// -------------------------------------------------------------------------
function Story() { this.state = common.createGameState(ROOMS(), "road"); }


Story.prototype.intro = function () {
  return "You are standing outside a lovely home in rural Nova Scotia \n \n"
      +  "There are the following items here: \n Sign, Note\n \n"
      +  "To the north you see a porch."
};

// Expects a struct like:
// cmd.verb
// cmd.target
//
// Returns a string response
Story.prototype.process_command = function(cmd) {

  if ( CMDS[cmd.verb] ) {
    return CMDS[cmd.verb]( this.state, cmd.verb, cmd.target, CMDS );
  } else {
    return "Syntax error";
  }

}

function create() {
  return new Story();
}

exports.create = create;
