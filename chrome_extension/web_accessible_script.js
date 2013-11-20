(function() {
  if (!qwebirc) {
    return;
  }
  var original = qwebirc.ui.Colourise;
  qwebirc.ui.Colourise = function() {
    fireEventMessageReceived(arguments); original.apply(this, arguments);
  };
})();

function fireEventMessageReceived(args) {
  var params = convertToJSON(args);
  if (params.channel === "Status") {
    return;
  }
  if (params.message.indexOf("4==") !== -1) {
    return;
  }
  var customEvent = document.createEvent("HTMLEvents");
  customEvent.initEvent("custom_event_message_received", true, false);
  customEvent.params = arguments.toString();

  var element = document.getElementById("autosave-bridge");
  element.innerText = JSON.stringify(params);
  element.dispatchEvent(customEvent);
}

function convertToJSON(args) {
  var channel = args[4].name;
  var timestamp = args[1].children[0].innerText;
  var message = args[0].replace(/\qwebirc:\/\/whois\/([^\/]*)\//, "\$1");

  var obj = {
    "channel": channel,
    "timestamp": timestamp,
    "message": message
  };
  return obj;
}
