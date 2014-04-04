(function(exports) {
	function Backdrop(game) {
		Phaser.Sprite.call(this, game, 0, 0, 'invisible'); //need a more appropriate image...
		this.width = game.world.width;
		this.height = game.world.height;
		this.inputEnabled = true;
		this.bubble = true;
		this.changeBubble = false;
		this.fixedToCamera = true;

		this.events.onClickBackdrop = new Phaser.Signal();
		this.events.onInputDown.add(function() {
			console.log('click');
			if(this.bubble) this.events.onClickBackdrop.dispatch();
		}, this);
	}

	Backdrop.preload = function(load) {
		load.image('invisible', 'assets/img/transparent white.png');
	}

	Backdrop.prototype = Object.create(Phaser.Sprite.prototype);
	Backdrop.prototype.constructor = Backdrop;

	_.extend(Backdrop.prototype, {
		// need to lag the bubble re-enable to the next frame so the "click" 
		// from the command gets processed first
		update: function() {
			if(this.changeBubble) {
				this.bubble = !this.bubble;
				this.changeBubble = false;
			}
		},

		onStartCommand: function() {
			this.bubble = false;
		},

		onEndCommand: function() {
			this.changeBubble = true; // we'll change it on the next frame
		}
	});

	exports.Backdrop = Backdrop;
})(this);