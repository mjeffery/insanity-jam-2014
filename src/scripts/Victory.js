(function(exports) {
	function Victory() {
		FadingState.call(this);
	}

	Victory.prototype = Object.create(FadingState.prototype);
	Victory.prototype.constructor = Victory;

	_.extend(Victory.prototype, {
		init: function(score) {
			this.score = score || 0;
		},

		create: function() {
			this.stage.backgroundColor = '#000000';

			this.game.add.bitmapText(25, 25, 'minecraftia', 'The Orcs have Fallen!\nYou Win', 24);
			var text = this.game.add.bitmapText(320, 425, 'minecraftia', 'Click to Continue', 17); 

			var peasants = game.add.image(385, 315, 'peasants-icon');
			peasants.anchor.setTo(0.5, 0.5);

			game.add.bitmapText(408, 320, 'minecraftia', 'x', 16);
			game.add.bitmapText(421, 312, 'minecraftia', '' + this.score || 0, 24);

			this.fadeIn(2500).onComplete.add(function() {
				this.ready = true;
			}, this);

			this.ready = false;
			this.clicked = false;

			this.input.onDown.add(function() {
				this.clicked = true;
				text.destroy();
			}, this);
		},

		update: function() {
			if(this.clicked && this.ready) {
				this.clicked = false;
				this.fadeOut(2000, 300).onComplete.add(this.game.mainMenu, this.game);
			}
		}
	});

	exports.Victory = Victory;
})(this);