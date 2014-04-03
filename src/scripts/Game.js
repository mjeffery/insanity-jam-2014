(function(exports) {
	function Game() {}

	Game.SCROLL_MARGIN = 50;
	Game.CAMERA_SPEED = 10;

	//build the slope map
	var slopeMap = {};
	for(var i = 0; i < 34; i++) slopeMap[i] = i-1;

	Game.preload = function(load) {
		load.tilemap('test-map-0', 'assets/tilemap/test-map-1.json', undefined, Phaser.Tilemap.TILED_JSON);
		load.image('placeholder-tiles', 'assets/img/placeholder tiles.png');
	}

	Game.prototype = {
		create: function() {
			var add = this.add,
				game = this.game,
				physics = this.game.physics;

			this.stage.backgroundColor = '#6495ED';
			physics.startSystem(Phaser.Physics.ARCADE);

			// TILEMAP
			var map = this.map = add.tilemap('test-map-0');
			var layer = this.layer = map.createLayer('terrain');
			map.addTilesetImage('terrain', 'placeholder-tiles');
			map.setCollisionBetween(2, 10, true);
			layer.resizeWorld();

			// ICON BAR
			var iconBar = this.iconBar = new IconBar(game);
			iconBar.x = Game.SCROLL_MARGIN;
			iconBar.y = 600 - (Game.SCROLL_MARGIN + 64);
			iconBar.fixedToCamera = true;

			iconBar.events.onIconSelected.add(this.onIconSelected, this);
			iconBar.events.onIconDeselected.add(this.onIconDeselected, this);

			// SELECTION MANAGER
			var selections = this.selections = new SelectionManager(game);
			
			selections.events.onSelectionChange.add(function(selected, added, removed) {
				if(_.isEmpty(selected)) this.iconBar.clear();
				else this.iconBar.showIcons('move', 'attack', 'defend', 'stop');
			}, this);

			// UNITS!!!
			//TODO move this whole section into its own unit management area...
			var units = this.units = add.group();
			units.add(new Soldier(game, 1400, 522));
			units.add(new Soldier(game, 1368, 522));
			units.add(new Archer(game, 1336, 522));
			units.add(new Peasant(game, 1304, 522));
			units.add(new Priest(game, 1304-64, 522));

			units.forEach(function(unit) {
				unit.events.onInputDown.add(selections.onInputDown, selections); 
			}, this);

			game.camera.x = 1000;
			game.camera.y = 222;
		},
		update: function() {
			var unit = this.unit,
				physics = this.game.physics;

			//TODO I don't like how the camera doesn't have a velocity...
			var pointer = this.input.mousePointer.position;
			if(pointer.x < Game.SCROLL_MARGIN) {
				this.camera.x += -Game.CAMERA_SPEED;
			}
			else if(pointer.x > this.game.width - Game.SCROLL_MARGIN) {
				this.camera.x += Game.CAMERA_SPEED;
			}
			if(pointer.y < Game.SCROLL_MARGIN) {
				this.camera.y += -Game.CAMERA_SPEED;
			}
			else if(pointer.y > this.game.height - Game.SCROLL_MARGIN) {
				this.camera.y += Game.CAMERA_SPEED;
			}

			physics.arcade.collide(this.units, this.layer);

		},

		onIconSelected: function(command) {
			console.log('entering "' + command + '"');
			var indicator = this.indicator = new CommandIndicator(this.game, 0, command);
			indicator.fixToInput = true;
			game.add.existing(indicator);
		},
		onIconDeselected: function(command) {
			console.log('exiting "' + command + '"');
			if(this.indicator) {
				this.indicator.destroy();
				this.indicator = null;
			}
		}
	};

	exports.Game = Game;
})(this);