
function help(state, verb, target, cmds) {
  var keys = [];
  for(var k in cmds) { keys.push(k); }

  return "Commands: " + keys.join(", ");
}

function read_item(state, verb, target, cmds) {
  return "stub";
}

// def read_item(state, target_name=None, **kwargs):
//   target = state.get_target(target_name)
//   check_verb(target, "read")
//   return [(False, "%s says '%s'" % (target.name(), target.verb_read())), ]

exports.help = help;
exports.read_item = read_item;

