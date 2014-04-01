(function(exports) {
	function Game() {}

	Game.SCROLL_MARGIN = 50;
	Game.CAMERA_SPEED = 10;

	Game.preload = function(load) {
		load.tilemap('test-map-0', 'assets/tilemap/test-map-0.json', undefined, Phaser.Tilemap.TILED_JSON);
		load.image('ninja-debug-64', 'assets/img/ninja-tiles64.png');
	}

	Game.prototype = {
		init: function() {
			this.scrollVel = new Phaser.Point();
		},
		create: function() {
			var add = this.add;

			this.stage.backgroundColor = '#6495ED';

			var map = this.map = add.tilemap('test-map-0');
			map.addTilesetImage('ninja-debug', 'ninja-debug-64');

			var layer = this.layer = map.createLayer('terrain');
			layer.resizeWorld();
		},
		update: function() {
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
		}
	};

	exports.Game = Game;
})(this);