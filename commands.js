
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
  var exits = room["exits"];
  var dir = ["north", "east", "west", "south"];
  for ( var i = 0; i < exits.length; i++ ) {
    if (exits[i] != null ) {
      adj_rooms.push( { direction: dir[i], name: exits[i] } );
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


  return { description: room["long"],
           exits: adj_rooms, 
           items: items };
}


function createStory(state,cmds) {
  return new Story(state, cmds);
}

exports.createStory = createStory;
