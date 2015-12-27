var history = {};

history.save = function(obj) {
  var key = "log#" + obj.date + obj.channel;
  localStorage[key] = localStorage[key] + obj.message + "\n";
};

history.load = function(key) {
  return localStorage["log#" + key];
}

history.loadAllKeys = function() {
  var keys = [];
  for (var key in localStorage) {
    if (key.indexOf("log#") == 0) {
      var words = key.split('#');
      words.shift();
      keys.push(words.join("#"));
    }
  }
  return keys;
};
module.exports = history;
