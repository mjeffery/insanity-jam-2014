(function(exports) {

	function CommandIndicator(game, x, command) {
		Phaser.TileSprite.call(
			this, 
			game, 
			x, 0, 
			8, game.world.height, 
			CommandIndicator.commandToKey[command]
		);

		this.anchor.setTo(0.5, 0);
		this.fixToInput = false;
	}

	CommandIndicator.prototype = Object.create(Phaser.TileSprite.prototype);
	CommandIndicator.prototype.constructor = CommandIndicator;

	CommandIndicator.commandToKey = {
		move: 'command-indicator-green',
		attack: 'command-indicator-red',
		defend: 'command-indicator-blue'
	};

	CommandIndicator.preload = function(load) {
		//load.spritesheet('command-indicators', 'assets/spritesheet/command indicators.png', 8, 32);
		load.image('command-indicator-red', 'assets/img/vertical red.png');
		load.image('command-indicator-blue', 'assets/img/vertical blue.png');
		load.image('command-indicator-green', 'assets/img/vertical green.png');
	}

	_.extend(CommandIndicator.prototype, {
		update: function() {
			if(this.fixToInput) {
				this.x = this.game.input.mousePointer.worldX;
			}
		}
	});

	exports.CommandIndicator = CommandIndicator;
})(this);