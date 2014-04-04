(function(exports) {
	function PickXCoordCommand(game, command) {
		this.game = game;
		this.command = command;
	}

	PickXCoordCommand.prototype = {
		start: function() {
			//TODO make this appear in the right visual layer
			var indicator = this.indicator = new CommandIndicator(this.game, 0, this.command);
			this.game.add.existing(indicator);
		},

		update: function() {
			if(this.indicator)
				this.indicator.x = this.game.input.mousePointer.worldX;

			return false;
		},

		cancel: function() {
			if(this.indicator) {
				this.indicator.destroy();
				this.indicator = null; 
			}
		}
	};

	exports.PickXCoordCommand = PickXCoordCommand;
})(this);