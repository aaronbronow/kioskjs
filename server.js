var express = require('express');
var fs = require('fs');
var path = require('path');
var app = express();

// app.get('/', function(req, res){
//   var body = 'Hello World';
//   res.setHeader('Content-Type', 'text/plain');
//   res.setHeader('Content-Length', body.length);
//   res.end(body);
// });

app.get('/api/kiosks', function(req, res){
  var kiosks = [];
  var kiosksPath = path.join(__dirname, 'kiosks');
  var dirs = fs.readdirSync(kiosksPath);

  for(var i = 0; i < dirs.length; i++){
    // TODO refactor this
    var kioskMeta = fs.readFileSync(path.join(kiosksPath, dirs[i], 'kiosk.json'));
    
    var kiosk = JSON.parse(kioskMeta);
    kiosk.path = "kiosks/" + dirs[i];
    kiosk.hashname = dirs[i];
    
    kiosks.push(kiosk);
  }

  res.setHeader('Content-Type', 'application/json');
  res.json(kiosks);  
});

app.get('/api/kiosks/:name', function(req, res){
  var kioskPath = path.join(__dirname, 'kiosks', req.params.name);
  
  console.log(kioskPath);
  
  // TODO refactor this
  var kioskMeta = fs.readFileSync(path.join(kioskPath, 'kiosk.json'));
  var kiosk = JSON.parse(kioskMeta);
  
  // kiosk.err = "kiosk not found";
  // 
  // res.setHeader('Content-Type', 'application/json');
  
  res.setHeader('Content-Type', 'application/json');
  res.json(kiosk);
});

app.use(express.static(__dirname + '/public'));
app.listen(process.env.PORT, process.env.IP);
console.log("Listening on " + process.env.IP + ":" + process.env.PORT);