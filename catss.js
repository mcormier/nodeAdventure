var common  = require('./commands.js');

function talk(state, verb, target_name, cmds) {

  if ( target_name.trim()  == "" ) { return "You mutter to yourself."; }

  var target = state.get_target(target_name);
  common.check_verb(target, "talk");
  return target.verb_talk(state);;
}


var CMDS = common.commands();
// Add a custom command for this game.
CMDS.talk = talk;


// -------------------------------------------------------------------------
//  Items
// -------------------------------------------------------------------------
function DiamondDoor() { 
  return { name: function () { return "door"; },
           verb_look: function (state) { 
             return "You see someone familiar through the door window."; },
           verb_open: function (state) { 
             if ( this.trash_added == false ) {
               var road = state.get_room("road");
               road.items.push(Trash());
             }

             this.open_count++;
             var extra_str = "One of them glares at you.";
             if ( this.open_count % 2 == 0 ) {
               extra_str = "One of them flips you the bird.";
             }

             return "The door is locked! It looks like a group of women were cold so "
                  + "they locked it. "+ extra_str ; },
           open_count: 0,
           trash_added: false
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

function Trash() { 
  return { name: function () { return "trash"; },
           verb_look: function (state) { 
             state.get_room().items.pop(this);
             state.get_room().items.push(FrankMagazine());
             state.get_room().items.push(SodaCan());
             state.get_room().items.push(PackOfCigs());
             return "You look closely at the trash and see a crushed soda can, a discarded frank "+
                    "magazine and a pack of cigarettes"; },
           
         }
}

function FrankMagazine() { 
  return { name: function () { return "magazine"; },
           verb_look: function (state) { 
             return "TODO" ; },
           verb_take: true
         }
}

function SodaCan() { 
  return { name: function () { return "soda can"; },
           verb_look: function (state) { 
             return "TODO" ; },
           verb_take: true
         }
}

function PackOfCigs() { 
  return { name: function () { return "cigarette pack"; },
           verb_look: function (state) { 
             return "TODO" ; },
           verb_take: true
         }
}

function Bartender() { 
  return { name: function () { return "bartender"; },
           verb_look: function (state) { 
             return "The bartender has lots of piercing's. She's pretty busy dealing with patrons." ; },
           verb_talk: function (state) { 
             return "Pekza who? I have no idea what you're talking about." ; }
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
      items: [ Bartender() ],
      exits: [null, null, null, null ]
    }



  };
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
  var state = common.createGameState(ROOMS(), "shoe_inside"); 
  var story =  common.createStory(state, CMDS);

  // Override the default behaviour
  story.get_adjacent_rooms = get_adjacent_rooms; 

  return story;
}

exports.create = create;
