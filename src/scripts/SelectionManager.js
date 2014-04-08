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

		onLasso: function(selected) {
			var multiselect = this.shiftKey.isDown,
				added, removed;

			if(_.isEmpty(selected) && !multiselect) {
				removed = this.remove(this.units);
				this.events.onSelectionChange.dispatch(this.units.slice(), [], removed);
			}
			else {
				if(multiselect) {
					added = this.add(selected);
				}
				else {
					removed = this.remove(_.without(this.units, selected));
					added = this.add(selected); 
				}

				this.events.onSelectionChange.dispatch(this.units.slice(), added, removed);
			}
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
						unit.events.onKilled.addOnce(this.onKilled, this);
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
		},

		forEach: function(callback, context) {
			_.each(this.units, callback, context);
		},

		onKilled: function(sprite) {
			var removed = this.remove(sprite);
			this.events.onSelectionChange.dispatch(this.units.slice(), [], removed);
		},

		onSpawn: function(unit) {
			//TODO this is non-ideal...
			if(! (unit instanceof Orc)) {
				unit.events.onInputDown.add(this.onInputDown, this); 
			}
		}
	};

	exports.SelectionManager = SelectionManager;
})(this);