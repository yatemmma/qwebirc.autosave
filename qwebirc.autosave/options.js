$(function() {
  $("h1").text(chrome.app.getDetails().name + ' ' + chrome.app.getDetails().version);
  $("#url").val(loadOption("options-url") || "enter url");
  $("#nickname").val(loadOption("options-nickname") || "");
  $("#channels").val(loadOption("options-channels") || "");
  $("#keywords").val(loadOption("options-keywords") || "");
  $("#save-button").click(saveOptions);
  $("#pre-link").click(onClickPreLink);
  $("#title-link").click(onClickTitleLink);
  loadMessages();
});

function saveOptions() {
  saveOption("options-url", $("#url").val());
  saveOption("options-nickname", $("#nickname").val());
  saveOption("options-channels", $("#channels").val());
  saveOption("options-keywords", $("#keywords").val());
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
  createDownloadLink(key);
  showTitle(key);
}

function showTitle(key) {
  var words = key.split("-");
  var title = words[2] + "_" + words[3];
  $("#show-title").text(title);
}

function createDownloadLink(key) {
  var words = key.split("-");
  var title = words[2] + "_" + words[3];
  $("#download-link").attr("download", title + ".txt");

  var href = "data:application/octet-stream;," + encodeURIComponent($("#textarea").val());
  $("#download-link").attr("href", href);
}

function deleteLogMessage(key) {
  localStorage.removeItem(key);
}

function onClickPreLink() {
  $("#textarea").val("<pre>\n" + $("#textarea").val() + "\n</pre>");
}

function onClickTitleLink() {
  $("#textarea").val($("#show-title").text() + "\n" + $("#textarea").val());
}
