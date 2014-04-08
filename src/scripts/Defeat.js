(function(exports) {
	function Defeat() {
		FadingState.call(this);
	}

	Defeat.prototype = Object.create(FadingState.prototype);
	Defeat.prototype.constructor = Defeat;

	_.extend(Defeat.prototype, {
		create: function() {
			this.stage.backgroundColor = '#000000';
			this.game.add.bitmapText(0, 0, 'minecraftia', 'The Orcs have Risen!\nGame Over', 24);
			var text = this.game.add.bitmapText(325, 425, 'minecraftia', 'Click to Continue', 17); 
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

	exports.Defeat = Defeat;
})(this);
