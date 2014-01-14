(function() {
  chrome.extension.sendRequest({"action": "getOptions"}, function(options) {
    if (location.href.indexOf(options.url) === -1) {
      return;
    }
    addBrigeElement(options);
    addOnDemandScript();
    addAutoSaveEventlisteners();
    setTimeout(function() {
      if (document.getElementById("loginnickname")) {
        document.getElementById("loginnickname").value = options.nickname;
        document.getElementById("loginchannels").value = options.channels;
      } else {
        document.getElementsByTagName("input")[0].value = options.nickname;
        document.getElementsByTagName("input")[1].value = options.channels;
      }
    }, 1000);
  });
})();

function addBrigeElement(options) {
  var bridgeElement = document.createElement('div');
  bridgeElement.id = "autosave-bridge";
  bridgeElement.style.display = "none";
  document.getElementsByTagName("body")[0].appendChild(bridgeElement);
}

function addOnDemandScript() {
  var targets = ["web_accessible_script.js"];
  targets.forEach(function(script) {
    var scriptElement = document.createElement("script");
    scriptElement.setAttribute("src", chrome.extension.getURL(script));
    document.documentElement.appendChild(scriptElement);
  });
}

function addAutoSaveEventlisteners() {
  var element = document.getElementById("autosave-bridge");
  element.addEventListener("custom_event_message_received", onMessageReceived, false);
  element.addEventListener("custom_event_user_joined", onUserJoined, false);
}

function onMessageReceived(event) {
  var messageParams = JSON.parse(event.target.innerText);
  chrome.extension.sendRequest({
    "action": "saveMessage",
    "params": messageParams
  });
}

function onUserJoined(event) {
  
}
