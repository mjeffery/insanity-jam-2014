(function(exports) {

	function Icon(game, command, selected, unselected) {
		Phaser.Sprite.call(this, game, 0, 0, 'command-icons');
		
		this.animations.add('selected', [selected]);
		this.animations.add('unselected', [unselected]);
		this.animations.play('unselected');

		this._selected = false;
		this.command = command;
	}

	Icon.prototype = Object.create(Phaser.Sprite.prototype);
	Icon.prototype.constructor = Icon;

	Object.defineProperty(Icon.prototype, 'selected', {
		get: function() { return this._selected },
		set: function(val) {
			var newVal = !!val;
			if(newVal != this._selected) {
				this._selected = newVal;
				this.animations.play( this._selected ? 'selected' : 'unselected' );
			}
		}
	});

	function IconBar(game) {
		Phaser.Group.call(this, game);

		this.icons = {
			move: this.addIcon('move', 1, 0, Phaser.Keyboard.E),
			attack: this.addIcon('attack', 3, 2, Phaser.Keyboard.Q),
			stop: this.addIcon('stop', 6, 6),
			gravityUp: this.addIcon('gravityUp', 8, 7, Phaser.Keyboard.R),
			gravityDown: this.addIcon('gravityDown', 10, 9, Phaser.Keyboard.F)
		};

		this.events = new Phaser.Events(); //since "events" is checked for all over the place...
		_.extend(this.events, {
			onIconSelected: new Phaser.Signal(),
			onIconDeselected: new Phaser.Signal(),
		});		
	}

	IconBar.prototype = Object.create(Phaser.Group.prototype);
	IconBar.prototype.constructor = IconBar;

	IconBar.preload = function(load) {
		load.spritesheet('command-icons', 'assets/spritesheet/command icons.png', 64, 64, 11);
	}

	_.extend(IconBar.prototype, {
		addIcon: function(command, selected, unselected, accelerator) {
			var icon = new Icon(this.game, command, selected, unselected, accelerator);

			icon.inputEnabled = true;
			icon.events.onInputDown.add(this.onIconClicked, this);
			icon.kill();

			if(accelerator !== undefined) {
				var key = icon.accelerator = this.game.input.keyboard.addKey(accelerator);
				key.onDown.add(function() {
					this.onIconClicked(icon);
				}, this);
			}

			this.add(icon);

			return icon;
		},

		display: function() {
			this.callAll('kill');

			var toShow = _.flatten(arguments),
				x = 0;

			_.each(toShow, function(name) {
				var icon = this.icons[name];
				if(icon) icon.reset(x, 0);
				x += 96;
			}, this);
		},

		onIconClicked: function(icon, pointer) {
			// make sure to deselect the existing icon if its different
			if(this.selectedIcon && this.selectedIcon != icon) {
				this.events.onIconDeselected.dispatch(this.selectedIcon.command);
				this.selectedIcon.selected = false;
			} 

			// deselect the icon
			if(icon.selected) {
				this.events.onIconDeselected.dispatch(icon.command);
				icon.selected = false;
				this.selectedIcon = null;
			}
			// select the icon
			else {
				this.events.onIconSelected.dispatch(icon.command);
				icon.selected = true;
				this.selectedIcon = icon;
			}
		},

		clearSelection: function() {
			if(this.selectedIcon) {
				this.events.onIconDeselected.dispatch(this.selectedIcon.command);
				this.selectedIcon.selected = false;
				this.selectedIcon = null;
			}
		},

		clear: function() {
			this.clearSelection();
			this.display();
		}
	});

	exports.IconBar = IconBar;
})(this);