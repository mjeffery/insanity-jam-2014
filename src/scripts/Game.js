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

			var map = this.map = add.tilemap('test-map-0');
			var layer = this.layer = map.createLayer('terrain');
			map.addTilesetImage('terrain', 'placeholder-tiles');
			map.setCollisionBetween(2, 10, true);
			layer.resizeWorld();

			var unit = this.unit = new Unit(game, 1400, 522);
			//TODO move to constructor
			physics.enable(unit, Phaser.Physics.ARCADE);
			unit.anchor.setTo(0.5, 0.5);
			unit.body.collideWorldBounds = true;
			unit.body.acceleration.y = 350;
			unit.inputEnabled = true;

			unit.events.onInputDown.add(function(sprite, pointer) {
				console.log('clicked');
				sprite.selected = !sprite.selected;	
			});

			add.existing(unit);

			game.camera.x = unit.x - 400;
			game.camera.y = unit.y - 300;
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

			physics.arcade.collide(this.unit, this.layer);

			if(unit.body.onFloor()) {
				unit.animations.play('stand');
			}
			else {
				unit.animations.play('falling');
			}
		}
	};

	exports.Game = Game;
})(this);