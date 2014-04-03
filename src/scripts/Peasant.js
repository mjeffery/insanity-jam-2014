(function(exports) {
	function Peasant(game, x, y) {
		Troop.call(this, game, x, y, 'peasant');
	}

	Peasant.prototype = Object.create(Troop.prototype);
	Peasant.prototype.constructor = Peasant;

	Peasant.preload = function(load) {
		load.spritesheet('peasant', 'assets/spritesheet/peasant.png', 32, 32);
	}

	exports.Peasant = Peasant;
})(this);