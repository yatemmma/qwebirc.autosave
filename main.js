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
  
  setMenu();
});

function setMenu() {
  var template = [{
    label: 'Setting',
    submenu: [{
        label: 'Setting',
        click: openSettingWindow
      }, {
        label: 'History',
        click: openHistoryWindow
      }]
  }];

  if (process.platform == 'darwin') {
    template.unshift({
      label: 'qwebirc-client',
      submenu: [{
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() { app.quit(); }
        }]
    });
  }
  var Menu = require('menu');
  var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function openSettingWindow() {
  var window = new BrowserWindow({ width: 500, height: 300});
  window.openDevTools();
  window.loadURL('file://' + __dirname + '/setting.html');
  window.on('closed', ()=>{
    window = null;
  });
}

function openHistoryWindow() {
  var window = new BrowserWindow({ width: 500, height: 300});
  window.openDevTools();
  window.loadURL('file://' + __dirname + '/setting.html');
  window.on('closed', ()=>{
    window = null;
  });
}
