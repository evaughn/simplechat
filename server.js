function start(){
	
	var http = require('http'), 
	fs = require('fs'),
	url = require('url'), 
	path = require('path'),
	express = require('express'),
	sanitize = require('validator').sanitize;

	var _app = express(), _server, _socket;

 	_app.use(express.compress());
	_app.use(express.static(__dirname + '/public'));
	
	_server = http.createServer(_app);

	_socket = require(__dirname + '/node_modules/socket.io/lib/socket.io').listen(_server);

	_server.listen(6572);

	_socket.sockets.on('connection', function (socket) {
	  socket.emit('news', {ip: 'Server', message: 'Welcome to Simple Chat' });
	  socket.on('chat', function (data) {
	  	if(data.message){
	  		data.message = sanitize(data.message).escape()
	  	}
	    socket.emit('news', data);
	  });
	});

	console.log('starting server');
}


exports.init = start;