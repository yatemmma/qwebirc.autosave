$(function() {
  var url = loadOption("options-url") || "enter url";
  $("#url").val(url);
  $("#save-button").click(saveUrl);
  loadMessages();
});

function saveUrl() {
  saveOption("options-url", $("#url").val());
  $("#saved").show();
  $("#saved").animate({opacity:"hide"}, {duration:1000, easing:"swing"});
}

function saveOption(key, value) {
  localStorage["qwebirc.autosave-" + key] = value;
}

function loadOption(key) {
  return localStorage["qwebirc.autosave-" + key];
}

function loadMessages() {
  var keys = [];
  for (var key in localStorage) {
    keys.push(key);
  }
  keys.sort().reverse().forEach(function(key) {
    var words = key.split("-");
    if (words[0] != "qwebirc.autosave" || words[1] != "messages" ) {
      return;
    }
    var logTitleStyle = "text-decoration:underline; cursor:pointer;";
    var title = "<span class='log-title' style='" + logTitleStyle + "' key='" + key + "'>" + words[2] + " " + words[3] + "</span>";
    var deleteButton = "<button class='delete-button' key='" + key + "'>delete</button>"
    $("#logs").append("<li>" + title + " " + deleteButton + "</li>");
  });
  $(".log-title").click(function() {
    showLogMessage($(this).attr("key"));
  });
  $(".delete-button").click(function() {
    deleteLogMessage($(this).attr("key"));
    $(this).parent().animate({opacity:"hide"}, {duration:1000, easing:"swing"});
  });
}

function showLogMessage(key) {
  var messages = JSON.parse(localStorage[key] || null);
  $("#textarea").val(messages.join("\n"));
}

function deleteLogMessage(key) {
  localStorage.removeItem(key);
  loadMessages();
}