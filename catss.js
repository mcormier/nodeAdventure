// TODO - duplicate ...
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
//
function Story() { }

Story.prototype.intro = function () {

  return  "You are on Argyle street on a cold December night.\n \n"
        + "There are the following items here: \n Sign, Note \n \n"
        + "To the south is the door to the Diamond. \n"
        + "To the east is the door to the Backstage Bar \n"
        + "To the north is the door to the Economy Shoe Shop";

};

// TODO -- duplicate push out of here
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
