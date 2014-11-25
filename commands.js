
function help(state, verb, target, cmds) {
  var keys = [];
  for(var k in cmds) { keys.push(k); }

  return "Commands: " + keys.join(", ");
}

// def check_verb(item, verb_name):
//     if hasattr(item, 'verb_%s' % (verb_name, )):
//             return item
//                 raise CantDoThat()
function check_verb(item, verb_name) {
  if ( item["verb_" + verb_name] != "undefined" ) {
    return item;
  }

  // TODO -- raise can't do that error
}

function read_item(state, verb, target_name, cmds) {
  var target = state.get_target(target_name);
  check_verb(target,"read");
  return target["name"]() + " says '" + target["verb_read"]() + "'";
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

// -------------------------------------------------------------------------
// State object
// -------------------------------------------------------------------------

function State(rooms, room_name) {
  this.rooms = rooms;
  this.room_name = room_name;
  this.backpack = [];
}

State.prototype.get_room = function(room_name) { 
  if (arguments.length == 0) {
    return this.rooms[this.room_name];
  }
  return this.rooms[room_name];
}

State.prototype.get_target = function(target_name) { 
  var items = this.get_all_items();
  for ( var i = 0; i < items.length; i++) {
    if ( target_name == items[i]["name"]() ) {
      return items[i];
    }
  }
}

State.prototype.get_all_items = function() { 
  return this.get_room()['items'];
}


function createState(rooms, room_name) {
  return new State(rooms, room_name);
}


exports.createGameState = createState;
