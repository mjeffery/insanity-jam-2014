(function(exports) {
	function Mission() {
		FadingState.call(this);
	}

	Mission.prototype = Object.create(FadingState.prototype);
	Mission.prototype.constructor = Mission;

	Mission.preload = function(load) {
		load.image('placeholder-tiles', 'assets/img/placeholder tiles.png');
		load.tilemap('test-map-0', 'assets/tilemap/test-map-1.json', undefined, Phaser.Tilemap.TILED_JSON);
	}

	_.extend(Mission.prototype, {

		SCROLL_MARGIN: 50,
		CAMERA_SPEED: 10,
		FADE_IN_DURATION: 2500,
		FADE_OUT_DURATION: 1500,
		FADE_OUT_DELAY: 200,

		//Like the state's constructor...
		init: function(terrainKey) {
			this.terrainKey = terrainKey || 'test-map-0';
		},

		create: function() {
			var add = this.add,
				game = this.game,
				physics = this.game.physics,
				keyboard = this.game.input.keyboard;

			this.stage.backgroundColor = '#6495ED';
			physics.startSystem(Phaser.Physics.ARCADE);

			var backdrop = this.backdrop = new Backdrop(game);
			game.add.existing(backdrop);

			// TILEMAP
			var map = this.map = add.tilemap(this.terrainKey);
			var layer = this.layer = map.createLayer('terrain');
			map.addTilesetImage('terrain', 'placeholder-tiles');
			map.setCollisionBetween(2, 10, true);
			layer.resizeWorld();

			// ICON BAR
			var iconBar = this.iconBar = new IconBar(game);
			iconBar.x = this.SCROLL_MARGIN;
			iconBar.y = 600 - (this.SCROLL_MARGIN + 64);
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

			selections.events.onSelectionChange.add(commands.onSelectionChange, commands);
			iconBar.events.onIconSelected.add(commands.onIconSelected, commands);
			iconBar.events.onIconDeselected.add(commands.onIconDeselected, commands);

			// Projectiles
			var arrows = this.arrows = new ArrowGroup(game);
			var gravityEffect = this.gravityEffect = new GravityEffect(game);
			var spells = this.spells = game.make.group(); 

			// SPAWNING 
			var humans = this.humans = add.group(),
				orcs = this.orcs = add.group();
				spawn = new Spawn(game, humans, orcs, arrows, spells, gravityEffect);

			// GAME RULES
			var rules = this.rules = new GameRules(game);

			rules.events.onVictory.add(this.onVictory, this);
			rules.events.onDefeat.add(this.onDefeat, this);

			spawn.events.onSpawn.add(rules.onSpawn, rules);
			spawn.events.onSpawn.add(selections.onSpawn, selections);

			// MISSION Parameters
			
			spawn.soldier(29, 16);
			spawn.soldier(31, 16);
			spawn.archer(36, 16);
			//spawn.peasant(39, 16);
			//spawn.priest(40, 16);

			//spawn.orc(12, 25);
			//spawn.orc(13, 25);
			//spawn.orc(14, 25);
			spawn.orc(24, 18);

			// This section ensure proper visual ordering...
			game.add.existing(arrows);	
			game.add.existing(spells);
			game.add.existing(gravityEffect);

			// FOG OF WAR
			var fog = this.fog = new FogOfWar(game, map);
			humans.forEach(fog.track, fog);

			// Lasso selection
			var lasso = this.lasso = new Lasso(game, humans);
			game.add.existing(lasso);

			backdrop.events.onInputDown.add(lasso.onInputDown, lasso);
			backdrop.events.onInputUp.add(lasso.onInputUp, lasso);

			commands.events.onStartCommand.add(lasso.onStartCommand, lasso);
			commands.events.onEndCommand.add(lasso.onEndCommand, lasso);

			lasso.events.onLasso.add(selections.onLasso, selections);

			// put the icons on top!
			game.world.bringToTop(iconBar);

			// CAMERA
			this.keys = {
				up: keyboard.addKey(Phaser.Keyboard.UP),
				down: keyboard.addKey(Phaser.Keyboard.DOWN),
				left: keyboard.addKey(Phaser.Keyboard.LEFT),
				right: keyboard.addKey(Phaser.Keyboard.RIGHT),
				W: keyboard.addKey(Phaser.Keyboard.W),
				A: keyboard.addKey(Phaser.Keyboard.A),
				S: keyboard.addKey(Phaser.Keyboard.S),
				D: keyboard.addKey(Phaser.Keyboard.D)
			};

			// Point the camera somewhere
			game.camera.x = 800;
			game.camera.y = 222;

			this.fadeIn(this.FADE_IN_DURATION);
		},
		update: function() {
			var keys = this.keys,
				rules = this.rules,
				humans = this.humans,
				orcs = this.orcs,
				arrows = this.arrows,
				spells = this.spells,
				physics = this.game.physics;

			if(keys.left.isDown || keys.A.isDown)
				this.camera.x -= this.CAMERA_SPEED;
			else if(keys.right.isDown || keys.D.isDown)
				this.camera.x += this.CAMERA_SPEED;
			if(keys.down.isDown || keys.S.isDown)
				this.camera.y += this.CAMERA_SPEED;
			else if(keys.up.isDown || keys.W.isDown)
				this.camera.y -= this.CAMERA_SPEED;

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
			this.rules.update();
		},

		onVictory: function(score) {
			this.fadeOut(this.FADE_OUT_DURATION, this.FADE_OUT_DELAY)
				.onComplete.addOnce(function() {
					this.game.victory(score);
				}, this);
		},

		onDefeat: function(score) {
			this.fadeOut(this.FADE_OUT_DURATION, this.FADE_OUT_DELAY)
				.onComplete.addOnce(function() {
					this.game.defeat();
				}, this);
		} 
	});

	exports.Mission = Mission;
})(this);