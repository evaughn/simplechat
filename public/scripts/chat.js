//Create out chat object

if(!chat){
	var chat = {};
}

//Create our chat's main module
chat.main = (function(){

	//initial variables
	var container = $("#chat"),
	messageContainer = $("#messages"),
	sendButton = $("#sendButton"),
	chatInput = $("#input"),
	messages = [],
	keys = {
		'enter':13,
		'up': 38,
		'down':40
	}
	counter = 0,
	timer =  null;
	var socket = io.connect('http://localhost/');
	//ipAddress: '';

	//init function -> sets up event listeners, fades in chat window on screen
	function start(){
		container.css({'opacity':'0'});

		container.animate({
			opacity: 1,
		}, 400);

	    socket.on('news', function (data) {
        	updateMessages(data);
  		});

  		sendButton.on('click', function(){
  			createMessage(socket);
  		});

		$(window).on('keydown', function(e){
			 checkTyping(e, socket);
		});
	};

	//creates our actual messages based on user input
	function createMessage(socket){
		var _message = chatInput.val();


		if(_message.length == 0 || _message == '' || _message == undefined){
			//if there isn't any user input, change bg of input field as indication
			chatInput.addClass('error');
		}else{
			//the user typed something, so let's change the color back, and send the message to our server
			chatInput.css({background:'#f6f6f6',color:'#394045'});
			socket.emit('chat', {'ip': '00.00.00','message': _message});

			//clear the input field
			chatInput.val('');
		};
		
	};

	function updateMessages(data){
		console.log(data)
		//if we receive a message from the server
		if(data.message){
			var html = '';

			//reset our counter to scroll the previous messages
			if(messages.length > 0){
				counter = messages.length;
			}

			if(counter == 0){
				html += "<div id='welcome' class='message new'><p>" + data.message + "</p></div>";
			}else{
				if($('#welcome').length != 0){
					$("#welcome").remove();
				}
				
				messages.push({'ip':data.ip, 'message':data.message});

				var _messages = messages, _count = messages.length;
				for(var i = 0; i < _count; i++){
					if(i == _count - 1){
						html += "<div class='message new'><p>" /*+ _messages[i]['ip'] + "  " */ + _messages[i]['message'] + "</p></div>";
					}else{
						html += "<div class='message'><p>" /*+ _messages[i]['ip'] + "  " */ +  _messages[i]['message'] + "</p></div>";
					}
				}
			}

			counter++;
			
			messageContainer.html(html);
			_scrollHeight = document.getElementById('messages').scrollHeight;
			
			if(_scrollHeight >= messageContainer.outerHeight()){
				messageContainer.scrollTop(_scrollHeight);

			}

			var _new = $('#messages .message.new').removeClass('new');

		}else{
			messageContainer.html = "There was a problem.";
		}
	};

	function scrollMessages(dir){
		if(dir === 'up'){
			if(counter > 0){
				chatInput.val(unescapeHTML(messages[counter-1]['message']));
				counter--;
			}
		}

		if(dir === 'down'){
			if(counter < messages.length - 1){
				chatInput.val(unescapeHTML(messages[counter+1]['message']));
				counter++;
			}
		}
		
	};

	//http://stackoverflow.com/questions/5302037/javascript-string-replace-lt-into
	function unescapeHTML(escapedHTML) {
	  return escapedHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
	}

    function userTyping(){
		if(timer){
			window.clearTimeout(timer);
			timer = null;
			$("#typing").show();
		}
			
		timer = setTimeout(function(){
			$("#typing").hide();
		}, 200);
			
	};

	function checkTyping(e,socket){

		if(e.keyCode == keys['enter']){
			createMessage(socket);
		}

		if(e.keyCode !== keys['enter'] &&  e.keyCode !== keys['up'] && e.keyCode !== keys['down']){
			userTyping();
		}

		if(messages.length > 0){
			if(e.keyCode === keys['up']){
				scrollMessages('up');
			}

			if(e.keyCode === keys['down']){
				scrollMessages('down');
			}
		}
	};

	return{
		start: start,
	}

})();

