var common  = require('./commands.js');
var CMDS = common.commands();

// -------------------------------------------------------------------------
//  Items
// -------------------------------------------------------------------------
function Sign() { 
  return { name: function () { return "sign"; },
           verb_read: function () { return "Dark Secret Software Inc. Corporate Office. Go inside for contact information."; }
         }
}

function Note() { 
  return { name: function () { return "note"; },
           verb_read: function () { return "Hello!"; }
         }
}

function Axe() { 
  return { name: function () { return "axe"; },
           verb_look: function () { return "A sharp splitting axe."; },
           verb_use: function (state) { 
               if ( state.room_name != "porch" ) {
                 return "You check the axe with your fingernail.  It's very sharp.";
               }
               var room = state.get_room();
               var door = state.get_item("door");
               if ( door.locked ) {
                 door.locked = false;
                 return "You smash the lock on the door.  It shatters."
               } 
               return "Don't you think you've done enough already?"; },
           verb_take: true
         }
}

function Computer() { 
  return { name: function () { return "computer"; },
           verb_look: function () { 
              var status = "";
              if (this.locked) { status = "The computer appears to be locked." }

              return "A desktop computer which seems to be running Ubuntu. "+
                     "It has a USB port on the front. " + status; },
           verb_use: function (state) { 
              if (this.locked) { return "It's locked."; }

               return "You tap a few keys on the keyboard. The computer responds with <br/>"+
"----------<br/>"+
"Congratulations!<br/>"+
"Send me an email! <a target='_blank' href='mailto:game@darksecretsoftware.com'>game@darksecretsoftware.com</a></br>"+
"Follow me on Twitter: <a target='_blank' href='http://twitter.com/#!/TheSandyWalsh'>@TheSandyWalsh</a><br/>"+
"Read my blog: <a target='_blank' href='http://sandywalsh.com'>www.SandyWalsh.com</a><br/>"+
"Look at <a target='_blank' href='https://github.com/mcormier/nodeAdventure'>the source code for this site.</a>"; 
           },

           locked: true
         }
}



function Door() { 
  return { name: function () { return "door"; },
           verb_look: function () { 
             var state = this.closed ? "closed" : "open";
             return "A large metal door, painted in a nice neutral color. " +
                    "The door is currently " + state; },
           verb_open: function (state) { 
               if ( this.locked ) { return "The door is locked."; }
               if ( this.closed == false ) { return "The door is already open"; }
               this.closed = false;
               var room = state.get_room();
               room.exits[1] = "foyer";
               return "The door opens effortlessly.";
            },
            verb_close: function (state) { 
             if ( this.closed) { return "The door is already closed"; }
             this.closed = true;
             var room = state.get_room();
             room.exits[1] = null;
             return "The door slowly closes and clicks shut.";
           },
           locked: true,
           closed: true
         }
}


// -------------------------------------------------------------------------
function ROOMS() {

  return  {
    "road": {
      short: "Ouside a lovely home.",
      long: "You are standing outside a lovely home in rural Nova Scotia",
      items: [ Sign(), Note() ],
      exits: ["porch", null, null, null]
    },
    "porch": {
      short: "The front step.",
      long: "You are on the front step of the house.",
      items: [ Door() ],
      exits: [null, null, "wood shed", "road"]
    },
    "foyer": {
      short: "The foyer of the house.",
      long: "You are in the tastefully decorated foyer of the house.",
      items: [ Computer() ],
      exits: [null, null, null, "porch"]
    },
    "wood shed": {
      short: "A wood shed",
      long: "Your are at the SW corner of the house, near the wood shed.",
      items: [ Axe() ],
      exits: ["trampoline", "porch", null, null]
    },
    "trampoline": {
      short: "In the backyard by the trampoline.",
      long: "In the NW corner of the backyard by the trampoline. A zipline runs East "
           +"to the NE corner of the backyard.",
      items: [],
      exits: [null, "muddy yard", null, "wood shed"]
    },
    "muddy yard": {
      short: "In a very muddy yard.",
      long: "In the backyard of the house, standing up to your ankles in mud. You can't go any further",
      items: [],
      exits: [null, null, "trampoline", null ]
    },
    "garden": {
      short: "In a small garden in the backyard.",
      long: "In the NE corner of the backyard. There is a lovely vegetable garden here."+
            " A zipline runs West to the NW corner of the backyard.",
      items: [],
      exits: [null, null, null, null ]
    }
  };
}

// -------------------------------------------------------------------------

function create() {
  var state = common.createGameState(ROOMS(), "road"); 
  return common.createStory(state, CMDS);
}

exports.create = create;
