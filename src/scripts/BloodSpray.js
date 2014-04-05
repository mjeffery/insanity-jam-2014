(function(exports) {
	function BloodSpray(game, key) {
		var emitter = this.emitter = game.add.emitter(0, 0, 100);
		emitter.makeParticles(key);
		emitter.gravity = 350; //TODO this should handle gravity in any direction...
	}

	BloodSpray.preload = function(load) {
		load.image('man-blood', 'assets/img/manblood.png');
		load.image('orc-blood', 'assets/img/orcblood.png');
	}

	BloodSpray.prototype = {
		spray: function(x, y) {
			var emitter = this.emitter;
			emitter.x = x;
			emitter.y = y;

			emitter.start(true, 500, null, 6);
		}
	}

	exports.BloodSpray = BloodSpray;
})(this);