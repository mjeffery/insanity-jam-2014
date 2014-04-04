(function(exports) {
	function Soldier(game, x, y) {
		Troop.call(this, game, x, y, 'knight');
		this.commands = Soldier.COMMANDS;
	}

	Soldier.prototype = Object.create(Troop.prototype);
	Soldier.prototype.constructor = Soldier;

	Soldier.COMMANDS = ['move', 'attack', 'defend', 'stop'];

	Soldier.preload = function(load) {
		load.spritesheet('knight', 'assets/spritesheet/knight.png', 32, 32);
	}

	exports.Soldier = Soldier;
})(this);