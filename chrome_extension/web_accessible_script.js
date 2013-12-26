var autoJoinFinished = false;
var qwebircExec = null;

(function() {
  if (!qwebirc) {
    return;
  }
  var originalColourise = qwebirc.ui.Colourise;
  qwebirc.ui.Colourise = function() {
    fireEventMessageReceived(arguments);
    originalColourise.apply(this, arguments);
  };
  var orgUserJoined = qwebirc.irc.IRCClient.prototype.userJoined;
  qwebirc.irc.IRCClient.prototype.userJoined = function() {
    fireEventUserJoined();
    orgUserJoined.apply(this, arguments);
  };
})();

function fireEventMessageReceived(args) {
  qwebircExec = args[2];
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

function fireEventUserJoined() {
  if (autoJoinFinished) {
    return;
  }
  autoJoinFinished = true;
  var customEvent = document.createEvent("HTMLEvents");
  customEvent.initEvent("custom_event_user_joined", true, false);

  var element = document.getElementById("autosave-bridge");
  element.dispatchEvent(customEvent);

  var channels = element.getAttribute("channels").split(" ");
  channels.forEach(function(channel) {
    setTimeout(function() {
      if (channel.substr(0, 1) === "#") {
        qwebircExec("/JOIN " + channel);
      }
    }, 3000);
  });
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
