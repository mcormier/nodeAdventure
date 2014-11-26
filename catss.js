var common  = require('./commands.js');
var CMDS = common.commands();

// -------------------------------------------------------------------------
//  Items
// -------------------------------------------------------------------------
function DiamondDoor() { 
  return { name: function () { return "door"; },
           verb_look: function (state) { 
             return "You see someone familiar through the door window."; },
           verb_open: function (state) { 
             return "The door is locked! It looks like a group of women were cold so "
                  + "they locked it. One of them glares at you." ; }
         }
}

function BackstageDoor() { 
  return { name: function () { return "door"; },
           verb_look: function (state) { 
             return "A set of double doors, you hear jovial laughter inside."; },
           verb_open: function (state) { 
             return "You open the door but there is a large crowd of people clustered near it. "
                  + "Someone that could be on America's biggest loser is preventing you from " 
                  + "opening it all the way" ; }
         }
}

function ShoeShopDoor() { 
  return { name: function () { return "door"; },
           verb_look: function (state) { 
             var state = this.closed ? "closed" : "open";
             return "It's a door.  It's cold out here maybe you should go in." +
                    "The door is currently " + state; },
           verb_open: function (state) { 
               if ( this.closed == false ) { return "The door is already open"; }
               this.closed = false;
               var room = state.get_room();
               room.exits[1] = "shoe_inside";
               return "The door opens effortlessly.";
            },
           verb_close: function (state) { 
             if ( this.closed) { return "The door is already closed"; }
             this.closed = true;
             var room = state.get_room();
             room.exits[1] = null;
             return "The door slowly closes and clicks shut.";
           },
           closed: true
         }
}



// -------------------------------------------------------------------------
// Direction reference -> N, E, W, S 
function ROOMS() {

  return  {
    "road": {
      short: "The street",
      long: "You are on Argyle street on a cold December night.",
      items: [ ],
      exits: ["shoe_out", "backstage_out", null, "diamond_out"]
    },
    "diamond_out": {
      short: "The Diamond Bar",
      long: "You are on the front step of the diamond.",
      items: [ DiamondDoor() ],
      exits: ["road", null, null, null]
    },
    "backstage_out": {
      short: "The Backstage Bar",
      long: "You are on the front step of the Backstage Bar.",
      items: [ BackstageDoor() ],
      exits: [null, null, "road", null]
    },
    "shoe_out": {
      short: "The Economy Shoe Shop",
      long: "You are on the front step of the Economy Shoe Shop .",
      items: [ ShoeShopDoor() ],
      exits: [null, null, null, "road" ]
    },
    "shoe_inside": {
      short: "The Economy Shoe Shop",
      long: "You are in the Economy Shoe Shop. People are chatting amongst themselves. " + 
            "You don't see anyone you know here.",
      items: [ ],
      exits: [null, null, null, null ]
    }



  };
}

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
