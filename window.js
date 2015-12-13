var history1 = require('./history.js');
var loginOptions = {
  nickname: localStorage['setting-nickname'] || '',
  channels: localStorage['setting-channels'] || ''
};
var remote = require('remote');
var app = remote.require('app');

var webview = document.getElementById("qwebirc");

webview.addEventListener('did-finish-load', ()=>{
  require('fs').readFile('./content.js', 'utf8', (err, text)=>{
    webview.executeJavaScript(text);
    webview.send('login-support', loginOptions);
  });
});

webview.addEventListener("dom-ready", function() {
  webview.openDevTools();
});

webview.addEventListener('ipc-message', function(event) {
  var dateTime = new Date(event.timeStamp).toISOString();
  var date = dateTime.split('T')[0];
  var time = dateTime.split('T')[1].split('.')[0]
  var obj = event.args[0];
  var channel = obj['4'].name;
  var message = obj['0'];
  if (channel === 'Status') {
    return;
  }
  message = message.split("").filter(function(x){
    return x.charCodeAt(0) >= 32;
  }).join('');
  
  if (message.indexOf("4==") == 0) {
    message = message.replace(/4== qwebirc:\/\/whois\/([^\/]*)\//, '== ' + "$1");
  } else if (message.indexOf("<") == 0) {
    searchWord = message.replace(/15qwebirc:\/\/whois\/([^\/]*)\//, "");
    message = message.replace(/15qwebirc:\/\/whois\/([^\/]*)\//, "$1");
    var keywords = (localStorage['setting-keywords'] || '').split(',').map((x)=>{
      return x.trim();
    });
    keywords.forEach((word)=>{
      if (searchWord.indexOf(word) > 0) {
        notifyKeyword(channel, message, word);
      }
    });
  }
  
  message = '[' + time + '] ' + message;
  
  var key = date + channel;
  console.log(new Date(event.timeStamp).toISOString());
  console.log(key + ' | ' + message);
  // history1.save(key, message); indexed DBにする
});

function notifyKeyword(channel, message, word) {
  new Notification("qwebirc-client: " + channel, {body: message});
}
