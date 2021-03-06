
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

exports.check_verb = check_verb;

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
  if ( target_name == null || target_name == undefined) { return null; }
  var target = state.get_target(target_name);
  if (  target == undefined) { return null; }
  
  check_verb(target,"look");
  return target.verb_look(state);
}

function take(state, verb, target_name, cmds) {
  var target = state.get_target(target_name);
  if ( target == undefined ) { return "I don't see that item here"; }

  if ( target.verb_take == undefined ) {
    return "You can't take that.";
  }

  state.add_to_backpack(target_name);
  return "You put the " + target.name() + " in your backpack." 
}

function move(state, verb, target_name, cmds) {
  var cmd = verb.charAt(0);
  var room = state.get_room();
  if ( room.exits.length == 0 ) {
    return "I can't go there";
  }

  if (cmd == 'g') {
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

function drop(state, verb, target_name, cmds) {
  var target = state.get_from_backpack(target_name);
  if ( target.verb_take == undefined ) { return "You can't drop that."; }

  state.remove_from_backpack(target_name);

  var room = state.get_room();
  room.items.push(target);
  return "You drop the " + target_name + ".";
}

function use(state, verb, target_name, cmds) {
  var target = state.get_target(target_name);
  check_verb(target,"use");
  return target.verb_use(state);
}

function inventory(state, verb, target_name, cmds) {
  if ( state.backpack.length == 0 ) { return "You are not carrying anything."; }

  var names = [];
  for ( var i = 0; i < state.backpack.length; i++ ) {
    names.push( state.backpack[i].name() );
  }

  return "You are carrying: " + names.sort().join(",");
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
    "reset": do_reset,
    "use": use,
    "take": take,
    "drop": drop,
    "i": inventory,
    "inventory": inventory
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

State.prototype.get_item = function(target_name) { 
  return this.get_target(target_name);
}


State.prototype.remove_from_backpack = function(target_name) { 
  for (var i = 0; i < this.backpack.length; i++) {
    if ( this.backpack[i].name() == target_name ) {
      return this.backpack.pop(this.backpack[i]);
    }
  }
}

State.prototype.get_from_backpack = function(target_name) { 
  for (var i = 0; i < this.backpack.length; i++) {
    var temp = this.backpack[i];
    if ( target_name == this.backpack[i].name() ) {
      return this.backpack[i];
    }
  }

  throw { name: "NotInBackpack", message: "You don't have that item in your backpack." }
}

State.prototype.get_all_items = function() { 
  return this.get_room().items.concat(this.backpack); 
}

State.prototype.add_to_backpack = function(target_name) { 
  var current_room = this.get_room();
  var target = this.get_target(target_name);
  target.is_in_backpack = true;
  this.backpack.push(target);

  this.remove_item(target_name);
}

State.prototype.remove_item = function(target_name) { 
  var items = this.get_room().items;
  for ( var i = 0; i < items.length; i++) {
    if ( target_name == items[i].name() ) {
      var removed = items[i];
      items.splice(i,1);
      return removed; 
    }
  }
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
    return "Syntax error - Try 'HELP'";
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

// Replace this function with synonyms for your story if
// you want to support synonyms.
//
// i.e. { "pack of cigarettes": "cigarette pack"}
//
// will remap pack of cigarettes to cigarette pack
//
Story.prototype.command_synonyms = function() {
  return { };
}

function createStory(state,cmds) {
  return new Story(state, cmds);
}

exports.createStory = createStory;
