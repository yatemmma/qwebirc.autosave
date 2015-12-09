'use strict';

const url = 'http://webchat.quakenet.org/?channels=dev';

var app = require('app');
var BrowserWindow = require('browser-window');
var mainWindow = null;

require('crash-reporter').start();

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {

  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL(url);
  
  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', function() {
    require('fs').readFile('./content.js', 'utf8', function (err, text) {
      mainWindow.webContents.executeJavaScript(text);
    });
  });

  const ipcMain = require('ipc-main');
  ipcMain.on('asynchronous-message', function(event, arg) {
    // TODO: receive message
    console.log(arg['0']);
  });
});
