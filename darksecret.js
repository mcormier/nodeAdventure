
function Story() { }


// Location
// Description
// Directions

Story.prototype.intro = function () {

  var intro = {};
  intro.location = "You are standing outside a lovely home in rural Nova Scotia";
  intro.description = "There are the following items here: \n Sign, Note"
  intro.directions = "To the north you see a porch."

  return intro;
};


function create() {
  return new Story();
}

exports.create = create;
