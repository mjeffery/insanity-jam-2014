(function(exports) {
	function Archer(game, x, y) {
		Troop.call(this, game, x, y, 'archer');
	}

	Archer.prototype = Object.create(Troop.prototype);
	Archer.prototype.constructor = Archer;

	Archer.preload = function(load) {
		load.spritesheet('archer', 'assets/spritesheet/archer.png', 32, 32);
	}

	exports.Archer = Archer;
})(this);