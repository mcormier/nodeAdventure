var common  = require('./commands.js');

function talk(state, verb, target_name, cmds) {

  if ( target_name.trim()  == "" ) { return "You mutter to yourself."; }

  var target = state.get_target(target_name);
  common.check_verb(target, "talk");
  return target.verb_talk(state);;
}

function read_item(state, verb, target_name, cmds) {
  var target = state.get_target(target_name);
  common.check_verb(target,"read");
  return target.verb_read();
}


var CMDS = common.commands();
// Add a custom command for this game.
CMDS.talk = talk;
CMDS.read = read_item;


// -------------------------------------------------------------------------
//  Items
// -------------------------------------------------------------------------
function DiamondDoor() { 
  return { name: function () { return "door"; },
           verb_look: function (state) { 
             return "You see someone familiar through the door window, near the back of the bar. Unfortunately they don't see you."; },
           verb_open: function (state) { 
             /*if ( this.trash_added == false ) {
               var road = state.get_room("road");
               road.items.push(Trash());
               this.trash_added = true;
             } */

             this.open_count++;
             var extra_str = "One of them glares at you.";
             if ( this.open_count % 2 == 0 ) {
               extra_str = "One of them flips you the bird.";
             }

             return "The door is locked! It looks like a group of women were cold so "
                  + "they locked it. "+ extra_str ; },
           open_count: 0
           //trash_added: false
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
             state.get_room().items.push(PackOfCigs());
             return "You look closely at the trash and see a crushed soda can, a discarded frank "+
                    "magazine and a pack of cigarettes"; },
           
         }
}

function FrankMagazine() { 
  return { name: function () { return "magazine"; },
           read_count: 0,
           verb_look: function (state) { return "A recent copy of Frank Magazine." ; },
           verb_read: function (state) { 
             this.read_count++;
             if ( this.read_count == 1 ) {
               return "You peruse an article about a local news reporter. Oh my, what a scandal.";
             }
             if ( this.read_count == 2 ) {
               return "Half of these articles are about Cape Breton, Yawn.";
             }
             if ( this.read_count == 3 ) {
               return "Apparently some local sports celebrity got really drunk and made an ass of himself.";
             }
             this.read_count = 0;
             return "You scan over several pages that just list who is suing who." ; },
           verb_take: true
         }
}


function PackOfCigs() { 
  return { name: function () { return "cigarette pack"; },
           verb_look: function (state) { 
             return "It's a crumpled pack of cigarettes.  Hey there's one left, this must be your lucky day!" ; },
           verb_use: function (state) {  
              if (state.room_name == "shoe_inside" ) {
               state.remove_from_backpack(this.name());
               var dude = state.remove_item("dude");
               state.get_room("road").items.push(dude);
               
               state.get_room().exits[3] = "hallway";

               return "You put the pack of cigarettes on an empty table near the dude.  He notices them and delcares \"There they are!\" like he's found his missing leg and heads outside. You can now use the hallway to the south.";
              }
              return "The surgeon general says that smoking is hazardous to your health. You probably need that last cigarette for some plot point, why don't you try it in another area?"; },
           verb_take: true
         }
}

function Bartender() { 
  return { name: function () { return "bartender"; },
           verb_look: function (state) { 
             return "The bartender has lots of piercing's and she's pretty busy dealing with patrons. You glance at her cleavage a second to long"; },
           verb_talk: function (state) { 
             return "Pekza who? I have no idea what you're talking about." ; }
         }
}

function Bartender2() { 
  return { name: function () { return "bartender"; },
           verb_look: function (state) { 
             return "The bartender is wearing a skinny tie."; },
           verb_talk: function (state) { 
             return "Gin and tonic? I don't know how to make that." ; }
         }
}



function Dude() { 
  return { name: function () { return "dude"; },
           dude_description: "He's a dude but not the dude you're looking for. He might be the bouncer as he's popping out of his T-shirt." ,
           verb_look: function (state) { 
             if (state.room_name == "shoe_inside") {
               return  this.dude_description + " He's blocking the hallway to the Backstage Bar and you notice nicotine stains on his fingers." ; 
             } 
             return this.dude_description;
         },
           verb_talk: function (state) { 
             if (state.room_name == "shoe_inside") {
               return "The dude's a real chatty Cathy.  You try to ask him to move out of the way but he thinks he knows you and starts telling you about how great he's been doing on his new diet.  You can't get a word in edgewise.";
             }
             return "You now know more than you ever wanted to know about proper bench press form.";
           }
         }
}

function DanceFloor() { 
  return { name: function () { return "dance floor"; },
           verb_look: function (state) { 
             return "You see several people dancing.  It's not a dedicated dance floor, but a floor that just happens to have people dancing on it. Past the dancers you see the entrace to the diamond."; },
           verb_use: function (state) { 
             state.get_room().exits[3] = "diamond_inside";
             return "You bring out your best dance moves, the microwave, the whirly burly, the jiggity-poo, culminating in your piece de resistance the swan which is so odd it completely clears the dance floor and opens a passage to the diamond." ; }
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
     "diamond_inside": {
      short: "The Diamond Bar",
      long: "You are inside the diamond. You've found your friends and settle down to a night of drinks and laughs.  Happy CATSS 2014. ",
      items: [ ],
      exits: ["backstage_inside", null, null, null]
    },
    "backstage_out": {
      short: "The Backstage Bar",
      long: "You are on the front step of the Backstage Bar.",
      items: [ BackstageDoor() , Trash()],
      exits: [null, null, "road", null]
    },
     "backstage_inside": {
      short: "The Backstage Bar",
      long: "You are in the Backstage Bar. You don't see anyone you know here but you hear uncontrollable laughter to the south that sounds very familiar.",
      items: [ Bartender2(), DanceFloor() ],
      exits: ["hallway", null, null, null]
    },
    "shoe_out": {
      short: "The Economy Shoe Shop",
      long: "You are on the front step of the Economy Shoe Shop.",
      items: [ ShoeShopDoor() ],
      exits: [null, null, null, "road" ]
    },
    "shoe_inside": {
      short: "The Economy Shoe Shop",
      long: "You are in the Economy Shoe Shop. People are chatting amongst themselves. " + 
            "You don't see anyone you know here.",
      items: [ Bartender(), Dude() ],
      exits: [null, null, "shoe_out", null ]
    },
    "hallway": {
      short: "A hallway",
      long: "You are in the hallway between the shoe and the backstage bar. Waiters and waitresses zip by you with freshly made nacho plates.",
      items: [  ],
      exits: ["shoe_inside", null, null, "backstage_inside"]
    }




  };
}

// returns short description instead of name
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
  var story = common.createStory(state, CMDS);

  state.backpack.push( FrankMagazine() );
  // Override the default behaviour
  story.get_adjacent_rooms = get_adjacent_rooms; 
  return story;
}

exports.create = create;
