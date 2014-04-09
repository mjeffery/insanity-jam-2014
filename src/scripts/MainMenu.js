(function(exports) {
	function MainMenu() {
		FadingState.call(this);
	}

	MainMenu.prototype = Object.create(FadingState.prototype);
	MainMenu.prototype.constructor = MainMenu;

	MainMenu.preload = function(load) {
		load.image('title', 'assets/img/title.png');
	}

	_.extend(MainMenu.prototype, {

		create: function() {
			var title = this.add.image(400, -300, 'title');
			title.anchor.setTo(0.5, 0.5);
			this.game.add.tween(title).to({ y: 250 }, 3200, Phaser.Easing.Bounce.Out, true);

			var text = this.game.add.bitmapText(325, 425, 'minecraftia', 'Click to Continue', 16);
			text.alpha = 0;

			this.ready = false;
			this.clicked = false;
			this.input.onDown.add(function() {
				this.clicked = true;
				text.destroy();
			}, this);
			
			this.fadeIn(2000, 350).onComplete.add(function() {
				this.ready = true;
			}, this);
				
			
				this.stage.backgroundColor = '#6495ED';
				text.alpha = 1;
		},

		update: function() {
			if(this.clicked && this.ready) {
				this.clicked = false;
				this.fadeOut(600).onComplete.addOnce(this.game.nextMission, this.game);
			}
		}
	});

	exports.MainMenu = MainMenu;
})(this);