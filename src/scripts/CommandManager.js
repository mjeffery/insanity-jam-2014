(function(exports) {
	function CommandManager(game, iconBar) {
		this.game = game;
		this.iconBar = iconBar;
		this.commands = {};
		this.activeCommand = null; 

		this.events = {
			onStartCommand: new Phaser.Signal(),
			onEndCommand: new Phaser.Signal()
		}
	}

	_.extend(CommandManager.prototype, {
		add: function(name, command) {
			this.commands[name] = command;
		},

		update: function() {
			var command = this.activeCommand;
			if(command) command.update();
		},

		onSelectionChange: function(selected, added, removed) {
			this.selection = selected;
			this.iconBar.clear();

			//selection was cleared...
			if(_.isEmpty(selected)) {
				//TODO enter the default state..
			}
			//otherwise, let's figure out what commands we need to show
			else {
				var commands =  getUniqueCommands(selected);
				this.iconBar.display(commands);
			}
		},

		onIconSelected: function(name) {
			var command = this.commands[name];
			if(command) {
				this.events.onStartCommand.dispatch(name);
				if(this.activeCommand)
					this.activeCommand.cancel();

				this.activeCommand = command;
				command.start(_.once(function(err, callback, context) {
					if(!err)
						_.forEach(this.selection, callback, context);
					else 
						console.log(err);

					this.activeCommand = null;
					this.iconBar.clearSelection();
					this.events.onEndCommand.dispatch(name, err);
				}.bind(this)));
			}
		},

		onIconDeselected: function(name) {
			var command = this.activeCommand;

			if(command && this.commands[name] === command) {
				command.cancel();
				this.activeCommand = null;
			}
		}
	});

	var commandOrder = {
		back: 0,
		move: 1,
		attack: 2,
		defend: 3,
		rally: 4,
		stop: 5
	};

	function getUniqueCommands(units) {
		return _(units)
			.pluck('commands')
			.flatten()
			.unique()
			.sortBy(function(command) { return commandOrder[command] || -1 })
			.valueOf();
	}

	exports.CommandManager = CommandManager;
})(this);