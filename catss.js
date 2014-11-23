
function Story() { }

Story.prototype.intro = function () {

  var intro = {};
  intro.location = "You are on Argyle street on a cold December night.";

  intro.description = "There are the following items here: \n Sign, Note"

  intro.directions = "To the south is the door to the Diamond. \n"
                   + "To the east is the door to the Backstage Bar \n"
                   + "To the north is the door to the Economy Shoe Shop";

  return intro;
};


function create() {
  return new Story();
}

exports.create = create;
