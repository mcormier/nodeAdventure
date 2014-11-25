var common  = require('./commands.js');
var CMDS = common.commands();

// -------------------------------------------------------------------------
function ROOMS() {

  return  {
    "road": {
      "short": "Ouside on the street. ",
      "long": "You are Argyle street ona cold December night.",
      items: [ ],
      "exits": [null, null, null, "diamond"]
    },
    "diamond": {
      "short": "The front step of the diamond.",
      "long": "You are on the front step of the diamond.",
      items: [],
      "exits": ["road", null, null, null]
    }

  };
}

//  "To the east is the door to the Backstage Bar \n"
//  "To the north is the door to the Economy Shoe Shop";



// -------------------------------------------------------------------------

function create() {
  var state = common.createGameState(ROOMS(), "road"); 
  return common.createStory(state, CMDS);
}

exports.create = create;
