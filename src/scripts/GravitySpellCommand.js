(function(exports) {
	function GravitySpellCommand(game, dir) {
		this.game = game;
		this.gravityDir = dir || Phaser.UP;
	}

	GravitySpellCommand.prototype = {
		start: function(callback) {
			this.callback = callback;
			this.game.input.onDown.addOnce(this.onDown, this);
		},

		update: function() { },

		cancel: function() {
			this.game.input.onDown.remove(this.onDown, this);
		},

		onDown: function() {
			var mouse = this.game.input.mousePointer,
				x = mouse.worldX,
				y = mouse.worldY;

			this.callback(null, function(unit) {
				//TODO some smart-cast would be cool here...
				unit.send({
					command: 'change-gravity',
					dir: this.gravityDir,
					target: { x: x, y: y }
				});
			}, this);
		}
	};

	exports.GravitySpellCommand = GravitySpellCommand;
})(this);