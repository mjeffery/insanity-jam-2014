(function(exports) {
	function HUD(game) {
		Phaser.Group.call(this, game); // not pefect, but it works...
	
		this.fixedToCamera = true;

		var peasants = game.make.image(710, 65, 'peasants-icon');
		peasants.anchor.setTo(0.5, 0.5);

		var x = game.make.bitmapText(733, 70, 'minecraftia', 'x', 16);
		var text = this.text = game.make.bitmapText(746, 62, 'minecraftia', '0', 24);

		var quit = game.make.image(20, 20, 'quit-icon');
		quit.scale.x = 0.5;
		quit.scale.y = 0.5;
		quit.inputEnabled = true;
		quit.events.onInputDown.add(this.game.mainMenu, this.game);

		this.add(peasants);
		this.add(x);
		this.add(text);
		this.add(quit);
	}

	HUD.prototype = Object.create(Phaser.Group.prototype);
	HUD.prototype.constructor = HUD;

	HUD.preload = function(load) {
		load.image('peasants-icon', 'assets/img/peasants icon.png');
		load.image('quit-icon', 'assets/img/quit icon.png');
	}

	_.extend(HUD.prototype, {
		onStateChange: function(state) {
			this.text.text = (state.count.peasants + state.pending.peasants);
		}
	});

	exports.HUD = HUD;
})(this);