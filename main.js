'use strict';

const url = 'http://webchat.quakenet.org/?channels=dev';

var app = require('app');
var BrowserWindow = require('browser-window');
var mainWindow = null;
var subWindow = null;

require('crash-reporter').start();

app.on('window-all-closed', ()=>{
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', ()=>{

  // mainWindow = new BrowserWindow({width: 800, height: 600});
  // mainWindow.loadURL(url);
  // mainWindow.on('closed', ()=>{
  //   mainWindow = null;
  // });

  // mainWindow.webContents.on('did-finish-load', ()=>{
  //   require('fs').readFile('./content.js', 'utf8', (err, text)=>{
  //     mainWindow.webContents.executeJavaScript(text);
  //   });
  // });
  
  subWindow = new BrowserWindow({ width: 800, height: 600});
  subWindow.openDevTools();
  subWindow.loadURL('file://' + __dirname + '/index.html');
  subWindow.on('closed', ()=>{
    subWindow = null;
  });

  const ipcMain = require('ipc-main');
  ipcMain.on('asynchronous-message', (event, arg)=>{
    // TODO: receive message
    console.log(arg['0']);
  });
});
