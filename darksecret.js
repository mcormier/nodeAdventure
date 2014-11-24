var common  = require('./commands.js');

var ROOMS = {
  "road": {
    "short": "Ouside a lovely home.",
    "long": "You are standing outside a lovely home in rural Nova Scotia",
    "exits": ["porch", null, null, null]
  },
  "porch": {
    "short": "The front step.",
    "long": "You are on the front step of the house."
  }

};

// -------------------------------------------------------------------------

var CMDS = {
  "help": common.help,
  "?": common.help,
  "read": common.read_item
}

// -------------------------------------------------------------------------
function State() {
  this.room_name = "road";
  this.backpack = [];
}

// -------------------------------------------------------------------------
function Story() { this.state = new State(); }


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
