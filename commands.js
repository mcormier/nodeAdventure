
function help(state, verb, target, cmds) {
  var keys = [];
  for(var k in cmds) { keys.push(k); }

  return "Commands: " + keys.join(", ");
}

// def read_item(state, target_name=None, **kwargs):
//   target = state.get_target(target_name)
//   check_verb(target, "read")
//   return [(False, "%s says '%s'" % (target.name(), target.verb_read())), ]
function read_item(state, verb, target, cmds) {
  return "stub";
}


// A default set of commands to use for a story.
function commands() {

   return  {
    "help": help,
    "?": help,
    "read": read_item
  }

}


exports.commands = commands;


