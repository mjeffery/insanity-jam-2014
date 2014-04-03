(function(exports) {
	function SelectionManager(game) {
		this.game = game;
		this.units = [];

		this.shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

		this.events = {
			onSelectionChange: new Phaser.Signal()
		}
	}

	SelectionManager.prototype = {
		
		onInputDown: function(sprite, pointer) {
			var multiselect = this.shiftKey.isDown,
				added, removed;

			if(sprite.selected) {
				// this is the only selected unit, treat it as a toggle
				if( multiselect ||
					(this.units.length === 1 && this.units[0] === sprite))
				{
					removed = this.remove(sprite);
				}
				// otherwise deselect everyone else
				else {
					removed = this.remove(_.without(this.units, sprite));
					added = this.add(sprite);
				}
			}
			else {
				// deselect all other sprites if not multiselect
				if(!multiselect) 
					removed = this.remove(_.without(this.units, sprite));
				added = this.add(sprite);
			}

			this.events.onSelectionChange.dispatch(this.units.slice(), added, removed);
		},

		add: function() {
			var added = [];

			_(arguments)
				.flatten()
				.each(function(unit) {
					if(!unit.selected) unit.selected = true;

					var idx = this.units.indexOf(unit);
					if(idx < 0) {
						this.units.push(unit);
						added.push(unit);
					}
				}, this);

			return added;
		},

		remove: function() {
			var removed = [];

			_(arguments)
				.flatten()
				.each(function(unit) {
					if(unit.selected) unit.selected = false;

					var idx = this.units.indexOf(unit);
					if(idx >= 0) {
						this.units.splice(idx, 1);
						removed.push(unit);
					}
				}, this);

			return removed;
		}
	};

	exports.SelectionManager = SelectionManager;
})(this);