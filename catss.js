
function Story() { }

Story.prototype.introText = function () {
  return "You are on Argyle Street on a cold December night.";
};


function create() {
  return new Story();
}

exports.create = create;
