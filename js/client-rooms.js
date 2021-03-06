(function($) {

	var RoomsRoom = this.RoomsRoom = Room.extend({
		type: 'rooms',
		title: 'Rooms',
		isSideRoom: true,
		events: {
			'click .ilink': 'clickLink'
		},
		initialize: function() {
			this.$el.addClass('ps-room-light').addClass('scrollable');
			app.on('response:rooms', this.update, this);
			app.send('/cmd rooms');
			app.user.on('change:named', this.updateUser, this);
			this.update();
		},
		clickLink: function(e) {
			if (e.cmdKey || e.metaKey || e.ctrlKey) return;
			e.preventDefault();
			e.stopPropagation();
			var roomid = $(e.currentTarget).attr('href').substr(app.root.length);
			app.tryJoinRoom(roomid);
		},
		updateUser: function() {
			this.update();
		},
		focus: function() {
			if (new Date().getTime() - this.lastUpdate > 60*1000) {
				app.send('/cmd rooms');
				this.lastUpdate = new Date().getTime();
			}
		},
		update: function(rooms) {
			if (rooms) {
				this.lastUpdate = new Date().getTime();
				this.rooms = rooms;
			} else {
				rooms = this.rooms;
			}
			if (!app.user.get('named')) {
				var buf = '<div class="pad"><p>You must be logged in to join rooms.</p></div>';
				this.$el.html(buf);
				return;
			}
			if (!rooms) {
				var buf = '<div class="pad"><p>Loading...</p></div>';
				this.$el.html(buf);
				return;
			}
			var buf = '<div class="pad"><div class="roomlist" style="max-width:300px">';

			buf += '<h2>Official chat rooms</h2>';
			for (var i=0; i<rooms.official.length; i++) {
				var roomData = rooms.official[i];
				var id = toId(roomData.title);
				buf += '<div><a href="' + app.root+id + '" class="ilink"><strong><i class="icon-comment-alt"></i> ' + Tools.escapeHTML(roomData.title) + '<br /></strong><small>(' + Number(roomData.userCount) + ' users)' + Tools.escapeHTML(roomData.desc||'')+ '</small></a></div>';
			}

			buf += '<h2>Chat rooms</h2>';
			for (var i=0; i<rooms.chat.length; i++) {
				var roomData = rooms.chat[i];
				var id = toId(roomData.title);
				buf += '<div><a href="' + app.root+id + '" class="ilink"><strong><i class="icon-comment-alt"></i> ' + Tools.escapeHTML(roomData.title) + '<br /></strong><small>(' + Number(roomData.userCount) + ' users)' + Tools.escapeHTML(roomData.desc||'')+ '</small></a></div>';
			}

			buf += '</div></div>';
			this.$el.html(buf);
		}
	});

}).call(this, jQuery);
