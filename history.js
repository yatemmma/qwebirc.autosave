var history = {
  
};
var db;
var indexedDB = window.indexedDB;
// indexedDB.deleteDatabase("history");
var openRequest = indexedDB.open("history", 1.0);
openRequest.onupgradeneeded = function(event) {
  db = event.target.result;
  var store = db.createObjectStore("logs", { keyPath: "key"});
  store.createIndex("valueIndex", "message");
}
openRequest.onsuccess = function(event) {
  db = event.target.result;
}

history.save = function(obj) {
  // localStorage['history#'+key] = value;
  
  var transaction = db.transaction(["logs"], "readwrite");
  var store = transaction.objectStore("logs");
  var request = store.put(obj);
  request.onsuccess = function (event) {
    // 更新後の処理
  }
};
history.loadAll = function() {
  var transaction = db.transaction(["logs"], "readwrite");
  var store = transaction.objectStore("logs");
  var request = store.openCursor();
   
  request.onsuccess = function (event) {
    if(event.target.result == null) {
      return;
    }
    var cursor = event.target.result;
    var data = cursor.value;
    console.log("key："  + cursor.key +  "  value：" + data.message);
    cursor.continue();
  }
};
module.exports = history;
