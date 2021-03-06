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

app.use(express.static(__dirname + '/public'));

app.use(express.logger());

app.get('/api/kiosks', function(req, res){
  var kiosks = [];
  var kiosksPath = path.join(__dirname, 'kiosks');
  var dirs = fs.readdirSync(kiosksPath);

  console.log("Looking for kiosks in " + kiosksPath);

  for(var i = 0; i < dirs.length; i++){
    // TODO refactor this
    var kioskMeta = fs.readFileSync(path.join(kiosksPath, dirs[i], 'kiosk.json'));
    
    var kiosk = JSON.parse(kioskMeta);
    kiosk.path = "kiosks/" + dirs[i];
    kiosk.hashname = dirs[i];
    
    console.log(kiosk.path);
    
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
  kiosk.path = "kiosks/" + req.params.name;
  kiosk.hashname = req.params.name;
  
  for(var i = 0; i < kiosk.scenes.length; i++) {
    if(kiosk.scenes[i].video && typeof(kiosk.scenes[i].video) != 'undefined') {
      kiosk.scenes[i].video_url = "api/kiosks/" + req.params.name + "/" + kiosk.scenes[i].video;
    }
    
    if(kiosk.scenes[i].gallery && typeof(kiosk.scenes[i].gallery) != 'undefined') {
      kiosk.scenes[i].gallery.load_url = "api/kiosks/" + req.params.name + "/" + kiosk.scenes[i].gallery.load;
    }
  }
  
  // kiosk.err = "kiosk not found";
  // 
  // res.setHeader('Content-Type', 'application/json');
  
  res.setHeader('Content-Type', 'application/json');
  res.json(kiosk);
});

app.get('/api/kiosks/:name/:image', function(req, res){
  var extension = path.extname(req.params.image);
  switch(extension){
  case '.png':
    res.setHeader('Content-Type', 'image/png');
    break;
  case '.jpg':
    res.setHeader('Content-Type', 'image/jpeg');
    break;
  case '.gif':
    res.setHeader('Content-Type', 'image/gif');
    break;
  case '.mov':
    res.setHeader('Content-Type', 'video/mp4');
    break;
  case '.mp4':
    res.setHeader('Content-Type', 'video/mp4');
    break;
  case '.webm':
    res.setHeader('Content-Type', 'video/webm');
    streamResponse(req, res, path.join(__dirname, 'kiosks', req.params.name, req.params.image), 'video/webm');
    return;
    break;
  case '.html':
    res.setHeader('Content-Type', 'text/html');
    break;
  default:
    res.setHeader('Content-Type', 'text/plain');
  }
  res.send(fs.readFileSync(path.join(__dirname, 'kiosks', req.params.name, req.params.image)));
});

function streamResponse(req, res, filePath, contentType) {
  var range = req.headers.range;
  var stat = fs.statSync(filePath);
  
  range = range.replace(/bytes=/, '').split('-');
  var start = parseInt(range[0], 10);
  var end = parseInt(range[1], 10);
  var total = stat.size;
  
  if(isNaN(end)) {
    end = total - 1;
  }
  
  var chunk = (end - start) + 1;
  console.log(start + '-' + end + '/' + total + ' ' + chunk);
  
  res.writeHead(206, {
    'Connection': 'close',
    'Content-Type': contentType,
    'Content-Length': chunk,
    'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
    'Transfer-Encoding': 'chunked',
    'Accept-Ranges': 'bytes'
  });
  
  var stream = fs.createReadStream(filePath,
      { flags: 'r', start: start, end: end});
      
  stream.pipe(res);
}

app.listen(3000);
console.log("Listening on " + 3000);