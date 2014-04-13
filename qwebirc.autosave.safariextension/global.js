(function(){
	if (!safari.extension.settings.url) {
		return;
	}
	safari.application.addEventListener("navigate", openHandler, true);
	safari.application.addEventListener('message', newMessage, true);
})();

function openHandler(event) {
	console.log(event);
	if (safari.extension.settings.url != event.target.url) {
		return;
	}
	event.target.page.dispatchMessage("Response", {
		nickname: safari.extension.settings.nickname || "",
		channels: safari.extension.settings.channels || ""
	});
}

function newMessage(event) {
	notifyMessage({keywords: safari.extension.settings.keywords || ""}, event.message);
}

function notifyMessage(options, params) {
	console.log(options);
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