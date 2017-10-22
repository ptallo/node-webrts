var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  app.use(express.static(__dirname + '/public'));
});

io.on('connection', function(socket){
  socket.on('add lobby', function(){
    console.log('add game room');
  });
});

http.listen(port, function(){
  console.log('listening on *: ' + port);
});
