var today;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (tab.url.indexOf(loadOptions().url) === -1) {
  	return;
  }
  chrome.pageAction.show(tabId);
  var now = new Date();
  today = "" + now.getFullYear() + (now.getMonth() + 1) + now.getDate();
});

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
      break;
    default:
      break;
  }
});

function loadOptions() {
  var options = {
    "url": localStorage["qwebirc.autosave-options-url"] || null
  };
  return options;
}

function saveMessage(params) {
  var key = "qwebirc.autosave-messages-" + today + "-" + params.channel;
  var messages = JSON.parse(localStorage[key] || null) || [];
  messages.push(params.timestamp + params.message);
  localStorage[key] = JSON.stringify(messages);
}
