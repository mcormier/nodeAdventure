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

function help() {
  var keys = [];
  for(var k in CMDS) { keys.push(k); }

  return "Commands: " + keys.join(", ");
}

var CMDS = {
  "help": help,
  "?": help
}

// -------------------------------------------------------------------------
function State() {
  this.room_name = "road";
  this.backpack = [];
}

// -------------------------------------------------------------------------
function Story() { }


Story.prototype.intro = function () {
  return "You are standing outside a lovely home in rural Nova Scotia \n \n"
      +  "There are the following items here: \n Sign, Note\n \n"
      +  "To the north you see a porch."
};

// Expects a struct like:
// cmd.verb
// cmd.target
//
// Returns 
Story.prototype.process_command = function(cmd) {

  if ( CMDS[cmd.verb] ) {
    console.log(CMDS[cmd.verb]());
    return CMDS[cmd.verb]();
  } else {
    return "Syntax error";
  }

}

function create() {
  return new Story();
}

exports.create = create;
