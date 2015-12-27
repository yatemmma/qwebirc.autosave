ipcRenderer = require('electron').ipcRenderer;

var originalColourise = qwebirc.ui.Colourise;
qwebirc.ui.Colourise = function() {
  // ipcRenderer.send('asynchronous-message', arguments);
  ipcRenderer.sendToHost('ipc-message', arguments);
  originalColourise.apply(this, arguments);
};

var orgUserJoined = qwebirc.irc.IRCClient.prototype.userJoined;
qwebirc.irc.IRCClient.prototype.userJoined = function() {
  orgUserJoined.apply(this, arguments);
};

ipcRenderer.on('login-support', function(event, arg) {
  if (document.getElementById("loginnickname")) {
    document.getElementById("loginnickname").value = arg.nickname;
    document.getElementById("loginchannels").value = arg.channels;
  } else {
    document.getElementsByTagName("input")[0].value = arg.nickname;
    document.getElementsByTagName("input")[1].value = arg.channels;
  }
});
