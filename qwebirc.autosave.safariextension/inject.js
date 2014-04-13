safari.self.addEventListener('message',function(evt){
	setInput(evt.message);
},false);

function setInput(options) {
	setTimeout(function() {
      if (document.getElementById("loginnickname")) {
        document.getElementById("loginnickname").value = options.nickname;
        document.getElementById("loginchannels").value = options.channels;
      } else {
        document.getElementsByTagName("input")[0].value = options.nickname;
        document.getElementsByTagName("input")[1].value = options.channels;
      }
      init();
    }, 1000);
}

function init() {
	addBrigeElement();
    addOnDemandScript();
    addAutoSaveEventlisteners();
}

function addBrigeElement() {
  var bridgeElement = document.createElement('div');
  bridgeElement.id = "autosave-bridge";
  bridgeElement.style.display = "none";
  document.getElementsByTagName("body")[0].appendChild(bridgeElement);
}

function addOnDemandScript() {
  var targets = ["web_accessible_script.js"];
  targets.forEach(function(script) {
    var scriptElement = document.createElement("script");
    scriptElement.text = "(" + execute.toString() + ")();";
    document.documentElement.appendChild(scriptElement);
  });
}

function addAutoSaveEventlisteners() {
  var element = document.getElementById("autosave-bridge");
  element.addEventListener("custom_event_message_received", onMessageReceived, false);
}

function onMessageReceived(event) {
	var messageParams = JSON.parse(event.target.innerText);
	safari.self.tab.dispatchMessage('newMessage', messageParams); 
}

function execute() {
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
}