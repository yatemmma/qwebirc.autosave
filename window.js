var loginOptions = {
  nickname: 'aiueo', channels: '#aiueo'
};

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
  console.log(event);
});
