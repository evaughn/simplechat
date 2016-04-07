function start(){
  
  var http = require('http'), 
  fs = require('fs'),
  url = require('url'), 
  path = require('path'),
  express = require('express'),
  sanitize = require('validator').sanitize,
  users = 0;

  var _app = express(), _server, _socket;

  _app.use(express.compress());
  _app.use(express.static(__dirname + '/public'));
  
  _server = http.createServer(_app);

  _socket = require(__dirname + '/node_modules/socket.io/lib/socket.io').listen(_server);

  _server.listen(6572);

  _socket.sockets.on('connection', function (socket) {
    users++
    socket.emit('news', {ip: 'Server', message: 'Welcome to Simple Chat' });
    socket.on('chat', function (data) {
      if(data.message){
        data.message = sanitize(data.message).escape();
        data.id = socket.id;
        data.users = users;
      }
      socket.emit('news', data);
    });

    socket.on('close', function(){
      users--;
    console.log('User logged out')
    })
  });

  console.log('starting server');
}


exports.init = start;
