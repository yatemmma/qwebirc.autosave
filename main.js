'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var mainWindow = null;

require('crash-reporter').start();

app.on('window-all-closed', ()=>{
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', ()=>{
  mainWindow = new BrowserWindow({ width: 800, height: 600});
  mainWindow.openDevTools();
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', ()=>{
    mainWindow = null;
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
  var window = new BrowserWindow({ width: 1000, height: 500});
  window.openDevTools();
  window.loadURL('file://' + __dirname + '/history.html');
  window.on('closed', ()=>{
    window = null;
  });
}
