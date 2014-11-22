
function Story() { }


Story.prototype.introText = function () {
  return "You are in the tastefully decorated foyer of the house.";
};


function create() {
  return new Story();
}

exports.create = create;
