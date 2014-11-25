var common  = require('./commands.js');
var CMDS = common.commands();

// -------------------------------------------------------------------------
//  Items
// -------------------------------------------------------------------------
function DiamondDoor() { 
  return { name: function () { return "door"; },
           verb_open: function (state) { return 
              "The door is locked! It looks like a group of girls was cold so "
             +"they locked the it. One of them glares at you." ; }
         }
}


// -------------------------------------------------------------------------
// Direction reference -> N, E, W, S 
function ROOMS() {

  return  {
    "road": {
      short: "The street",
      long: "You are Argyle street on a cold December night.",
      items: [ ],
      exits: [null, null, null, "diamond"]
    },
    "diamond": {
      short: "The front step of the diamond",
      long: "You are on the front step of the diamond.",
      items: [ DiamondDoor() ],
      exits: ["road", null, null, null]
    }

  };
}

//  "To the east is the door to the Backstage Bar \n"
//  "To the north is the door to the Economy Shoe Shop";

function default_context() {
  var room = this.state.get_room();
  var adj_rooms = this.get_adjacent_rooms();
    
  var items = [];
  for ( var i = 0; i < room.items.length; i++ ) {
    items.push(room.items[i].name());
  } 

  console.log("TODO");    
    
  return { description: room.long,
           exits: adj_rooms,
           items: items };
}   


function get_adjacent_rooms() {
  var adj_rooms = [];
  var room = this.state.get_room();
  var dir = ["north", "east", "west", "south"];
  for ( var i = 0; i < room.exits.length; i++ ) {
    if (room.exits[i] != null ) {
      var other_room = this.state.get_room(room.exits[i]);
      adj_rooms.push( { direction: dir[i], name: other_room.short } );
    }
  }

 return adj_rooms;
} 


// -------------------------------------------------------------------------

function create() {
  var state = common.createGameState(ROOMS(), "road"); 
  var story =  common.createStory(state, CMDS);

  // Override the default behaviour
  story.get_adjacent_rooms = get_adjacent_rooms; 

  return story;
}

exports.create = create;
