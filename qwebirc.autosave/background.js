var today;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (tab.url.indexOf(loadOptions().url) === -1) {
    return;
  }
  chrome.pageAction.show(tabId);
  var now = new Date();
  today = "" + now.getFullYear() + ("0" + (now.getMonth() + 1)).slice(-2) + ("0" + now.getDate()).slice(-2);
});

function removeNotEnableNotice(tabId) {
  chrome.tabs.insertCSS(tabId, {code: '{}'}, function(result) {
    console.log(result);
  });
}

chrome.pageAction.onClicked.addListener(function() {
  chrome.tabs.create({
    "url": chrome.extension.getURL("options.html"),
  });
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  switch(request.action) {
    case 'getOptions':
      sendResponse(loadOptions());
      break;
    case 'saveMessage':
      saveMessage(request.params);
      notifyMessage(loadOptions(), request.params);
      break;
    default:
      break;
  }
});

function loadOptions() {
  var options = {
    "url": localStorage["qwebirc.autosave-options-url"] || null,
    "nickname": localStorage["qwebirc.autosave-options-nickname"] || null,
    "channels": localStorage["qwebirc.autosave-options-channels"] || null,
    "keywords": localStorage["qwebirc.autosave-options-keywords"] || null
  };
  return options;
}

function saveMessage(params) {
  var key = "qwebirc.autosave-messages-" + today + "-" + params.channel;
  var messages = JSON.parse(localStorage[key] || null) || [];
  messages.push(params.timestamp + params.message);
  localStorage[key] = JSON.stringify(messages);
}

function notifyMessage(options, params) {
  var message = params.message.replace(/^<.*> /, "");
  var keywords = options.keywords.split(",");
  var matches = keywords.filter(function(keyword) {
    return message.match(keyword);
  });
  if (matches.length) {
    sendNotification(params.channel, params.message);
  }
}

function sendNotification(title, message) {
  window.webkitNotifications.createNotification("icon48.png", title, message).show();
}