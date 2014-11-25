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

// -------------------------------------------------------------------------
function ROOMS() {

  return  {
    "road": {
      "short": "Ouside a lovely home.",
      "long": "You are standing outside a lovely home in rural Nova Scotia",
      items: [ Sign(), Note() ],
      "exits": ["porch", null, null, null]
    },
    "porch": {
      "short": "The front step.",
      "long": "You are on the front step of the house.",
      items: [],
      "exits": [null, null, null, "road"]
    }

  };
}

// -------------------------------------------------------------------------

function create() {
  var state = common.createGameState(ROOMS(), "road"); 
  return common.createStory(state, CMDS);
}

exports.create = create;
