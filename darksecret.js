
function Story() { }


// Location
// Description
// Directions

Story.prototype.introText = function () {

  var intro = {};
  intro.location = "You are standing outside a lovely home in rural Nova Scotia";
  intro.description = "There are the following items here: \n Sign, Note"
  intro.directions = "To the north you see a porch."

  return "You are in the tastefully decorated foyer of the house.";
};


function create() {
  return new Story();
}

exports.create = create;
