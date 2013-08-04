var chat = {
	container: $("#chat"),
	messageContainer: $("#messages"),
	chatInput: $("#input"),
	messages: [],
	counter: 0,
	timer: null,
	//ipAddress: '';

	start: function(){
		this.container.css({'opacity':'0'});

		this.container.animate({
			opacity: 1,
		}, 400);
	},

	createMessage: function(socket){
		var _message = this.chatInput.val();

		if(_message.length == 0 || _message == '' || _message == undefined){
			this.chatInput.css({'background':'rgba(255,0,0,.6)','color':'#f6f6f6'});
		}else{
			this.chatInput.css({background:'#f6f6f6',color:'#394045'});
			socket.emit('chat', {'ip': '00.00.00','message': _message});
			this.chatInput.val('');
		};
		
	},

	updateMessages: function(data){
		
		if(data.message){
			var html = '';

			if(this.messages.length > 0){
				this.counter = this.messages.length;
			}

			if(this.counter == 0){
				html += "<div id='welcome' class='message new'><p>" + data.message + "</p></div>";
			}else{
				if($('#welcome').length != 0){
					$("#welcome").remove();
				}

				this.counter = this.messages.length;
				
				this.messages.push({'ip':data.ip, 'message':data.message});

				var _messages = this.messages, _count = this.messages.length;
				for(var i = 0; i < _count; i++){
					if(i == _count - 1){
						html += "<div class='message new'><p>" /*+ _messages[i]['ip'] + "  " */ + _messages[i]['message'] + "</p></div>";
					}else{
						html += "<div class='message'><p>" /*+ _messages[i]['ip'] + "  " */ +  _messages[i]['message'] + "</p></div>";
					}
				}
			}

			this.counter++;
			
			this.messageContainer.html(html);
			_scrollHeight = document.getElementById('messages').scrollHeight;
			
			if(_scrollHeight >= this.messageContainer.outerHeight()){
				this.messageContainer.scrollTop(_scrollHeight);

			}

			var _new = $('#messages .message.new').removeClass('new');

		}else{
			this.messageContainer.html = "There was a problem.";
		}
	},

	scrollMessages: function(dir){
		if(dir == 'up'){
			if(this.counter > 0){
				this.chatInput.val(this.messages[this.counter-1]['message']);
				this.counter--;
			}
		}

		if(dir == 'down'){
			if(this.counter < this.messages.length - 1){
				this.chatInput.val(this.messages[this.counter+1]['message']);
				this.counter++;
			}
		}
	},

	userTyping: function(){
		if(this.timer){
			window.clearTimeout(this.timer);
			this.timer = null;
			$("#typing").show();
		}
			
		this.timer = setTimeout(function(){
			$("#typing").hide();
		}, 500);
			
	},

};

