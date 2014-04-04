(function(exports) {
	function PickXCoordCommand(game, command) {
		this.game = game;
		this.command = command;
	}

	PickXCoordCommand.prototype = {
		start: function(callback) {
			this.callback = callback;

			//TODO make this appear in the right visual layer
			var indicator = this.indicator = new CommandIndicator(this.game, 0, this.command);
			this.game.add.existing(indicator);

			this.game.input.onDown.addOnce(this.onDown, this);
		},

		update: function() {
			if(this.indicator)
				this.indicator.x = this.game.input.mousePointer.worldX;
		},

		cancel: function() {
			this.destroyIndicator();
			this.game.input.onDown.remove(this.onDown, this);
		},

		onDown: function() {
			var pos = this.game.input.mousePointer.worldX;

			this.destroyIndicator();
			this.callback(null, function(unit) {
				unit.send({ command: this.command, target: pos });
			}, this);
		},

		destroyIndicator: function() {
			if(this.indicator) {
				this.indicator.destroy();
				this.indicator = null; 
			}
		}
	};

	exports.PickXCoordCommand = PickXCoordCommand;
})(this);