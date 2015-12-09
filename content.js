var options = {
  nickname: 'aiueo', channels: '#aiueo'
};
setTimeout(function() {
  if (document.getElementById("loginnickname")) {
    document.getElementById("loginnickname").value = options.nickname;
    document.getElementById("loginchannels").value = options.channels;
  } else {
    document.getElementsByTagName("input")[0].value = options.nickname;
    document.getElementsByTagName("input")[1].value = options.channels;
  }
}, 1000);


var ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('asynchronous-reply', function(event, arg) {
  // TODO: do something
  console.log(arg);
  alert(arg);
});

var originalColourise = qwebirc.ui.Colourise;
qwebirc.ui.Colourise = function() {
  ipcRenderer.send('asynchronous-message', arguments);
  originalColourise.apply(this, arguments);
};

var orgUserJoined = qwebirc.irc.IRCClient.prototype.userJoined;
qwebirc.irc.IRCClient.prototype.userJoined = function() {
  orgUserJoined.apply(this, arguments);
};
