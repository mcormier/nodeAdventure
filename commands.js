
function help(state, verb, target, cmds) {
  var keys = [];
  for(var k in cmds) { keys.push(k); }

  return "Commands: " + keys.join(", ");
}

function check_verb(item, verb_name) {
  if ( item != undefined && item["verb_" + verb_name] != undefined ) {
    return item;
  }
  throw { name: "CantDoThat", message: "I don't see that item here" }
}

function read_item(state, verb, target_name, cmds) {
  var target = state.get_target(target_name);
  check_verb(target,"read");
  return target.name() + " says '" + target.verb_read() + "'";
}

function do_reset(state, verb, target_name, cmds) {
  throw { name: "StartOver", message: "" }
}

function do_open(state, verb, target_name, cmds) {
  var target = state.get_target(target_name);
  check_verb(target,"open");
  return target.verb_open(state);
}

function do_close(state, verb, target_name, cmds) {
  var target = state.get_target(target_name);
  check_verb(target,"close");
  return target.verb_close(state);
}

function look(state, verb, target_name, cmds) {
  if ( target_name == undefined ) {
    return null;
  }

  var target = state.get_target(target_name);
  check_verb(target,"look");
  return target.verb_look(state);
}

function move(state, verb, target_name, cmds) {
  var cmd = verb.charAt(0);
  var room = state.get_room();
  if ( room.exits.length == 0 ) {
    return "I can't go there";
  }

  if (cmd = 'g') {
    // Supports GO PORCH or GO WOOD SHED
    for ( var i = 0; i < room.exits.length; i++ ) {
       if ( room.exits[i] == target_name ) {
         state.room_name = room.exits[i];
         return null;
       }
    } 
     
    // Supports GO NORTH by falling through
    if ( target_name == undefined ) { return "I don't know where that is"; }
    cmd = target_name.charAt(0);
  } 


  var directions = ["n", "e", "w", "s" ];
  var dir_index = directions.indexOf(cmd);

  if (room.exits[dir_index] == null ) {
    return "I don't see any exit in that direction.";
  }

  state.room_name = room.exits[dir_index];

  return null;
}


// A default set of commands to use for a story.
function commands() {
   return  {
    "help": help,
    "?": help,
    "read": read_item,
    "north": move,
    "south": move,
    "west": move,
    "east": move,
    "go": move,
    "n": move,
    "s": move,
    "w": move,
    "e": move,
    "look": look,
    "open": do_open,
    "close": do_close,
    "reset": do_reset
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
    if ( target_name == items[i].name() ) {
      return items[i];
    }
  }
}

State.prototype.get_all_items = function() { 
  return this.get_room().items;
}


function createState(rooms, room_name) {
  return new State(rooms, room_name);
}

exports.createGameState = createState;
// -------------------------------------------------------------------------
// State object
// -------------------------------------------------------------------------
function Story(state, cmds) { 
  this.state = state;
  this.cmds = cmds;
}

Story.prototype.process_command = function(cmd) {

  if ( this.cmds[cmd.verb] ) {
    return this.cmds[cmd.verb]( this.state, cmd.verb, cmd.target, this.cmds );
  } else {
    return "Syntax error";
  }   

}

Story.prototype.get_adjacent_rooms= function() {
  var adj_rooms = [];
  var room = this.state.get_room();
  var dir = ["north", "east", "west", "south"];
  for ( var i = 0; i < room.exits.length; i++ ) {
    if (room.exits[i] != null ) {
      adj_rooms.push( { direction: dir[i], name: room.exits[i] } );
    }
  }

 return adj_rooms;
}

Story.prototype.default_context = function() {
  var room = this.state.get_room();
  var adj_rooms = this.get_adjacent_rooms();

  var items = []; 
  for ( var i = 0; i < room.items.length; i++ ) {
    items.push(room.items[i].name());
  }


  return { description: room.long,
           exits: adj_rooms, 
           items: items };
}


function createStory(state,cmds) {
  return new Story(state, cmds);
}

exports.createStory = createStory;
