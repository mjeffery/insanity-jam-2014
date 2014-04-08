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

			var backdrop = this.backdrop = new Backdrop(game);
			game.add.existing(backdrop);

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

			// SELECTION MANAGER
			var selections = this.selections = new SelectionManager(game);

			// COMMAND MANAGER
			var commands = this.commands = new CommandManager(game, iconBar);
			commands.add('move', new PickXCoordCommand(game, 'move'));
			commands.add('attack', new PickXCoordCommand(game, 'attack'));
			commands.add('defend', new PickXCoordCommand(game, 'defend'));
			commands.add('stop', new StopCommand());
			commands.add('gravityUp', new GravitySpellCommand(game, Phaser.UP));
			commands.add('gravityDown', new GravitySpellCommand(game, Phaser.DOWN));

			// hooking up the wires...
			selections.events.onSelectionChange.add(commands.onSelectionChange, commands);
			iconBar.events.onIconSelected.add(commands.onIconSelected, commands);
			iconBar.events.onIconDeselected.add(commands.onIconDeselected, commands);

			backdrop.events.onClickBackdrop.add(selections.onClickBackdrop, selections);

			commands.events.onStartCommand.add(backdrop.onStartCommand, backdrop);
			commands.events.onEndCommand.add(backdrop.onEndCommand, backdrop);

			// Projectiles
			var arrows = this.arrows = new ArrowGroup(game);
			var gravityEffect = this.gravityEffect = new GravityEffect(game);
			var spells = this.spells = game.make.group(); 

			// UNITS!!!
			//TODO move this whole section into its own unit management area...
			var humans = this.humans = add.group(),
				orcs = this.orcs = add.group();
				spawn = new Spawn(game, humans, orcs, arrows, spells, gravityEffect);

			humans.add(spawn.soldier(29, 16));
			humans.add(spawn.soldier(31, 16));
			humans.add(spawn.archer(36, 16));
			humans.add(spawn.peasant(39, 16));
			humans.add(spawn.priest(40, 16));

			//these have to be added each time a humansly unit is added
			humans.forEach(function(unit) {
				unit.events.onInputDown.add(selections.onInputDown, selections); 
			}, this);

			//ORCS!!!!!
			//TODO mvoe this whole section int is own management area
			orcs.add(spawn.orc(12, 25));
			orcs.add(spawn.orc(13, 25));
			orcs.add(spawn.orc(14, 25));
			orcs.add(spawn.orc(24, 18));

			game.add.existing(arrows);	
			game.add.existing(spells);
			game.add.existing(gravityEffect);

			var fog = this.fog = new FogOfWar(game, map);
			humans.forEach(fog.track, fog);

			game.world.bringToTop(iconBar);

			game.camera.x = 1000;
			game.camera.y = 222;
		},
		update: function() {
			var humans = this.humans,
				orcs = this.orcs,
				arrows = this.arrows,
				spells = this.spells,
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

			physics.arcade.collide(humans, this.layer);
			physics.arcade.collide(orcs, this.layer);
			physics.arcade.collide(arrows, this.layer, Arrow.collideWorld, Arrow.processWorld);
			physics.arcade.overlap(arrows, orcs, Arrow.collideOrc);

			physics.arcade.overlap(spells, orcs, GravityField.changeGravity);
			physics.arcade.overlap(spells, humans, GravityField.changeGravity);

			humans.callAll('think');
			orcs.callAll('think');

			this.fog.update();

			this.commands.update();

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