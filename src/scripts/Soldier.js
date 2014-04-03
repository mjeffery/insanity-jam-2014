(function(exports) {
	function Soldier(game, x, y) {
		Troop.call(this, game, x, y, 'knight');
	}

	Soldier.prototype = Object.create(Troop.prototype);
	Soldier.prototype.constructor = Soldier;

	Soldier.preload = function(load) {
		load.spritesheet('knight', 'assets/spritesheet/knight.png', 32, 32);
	}

	exports.Soldier = Soldier;
})(this);