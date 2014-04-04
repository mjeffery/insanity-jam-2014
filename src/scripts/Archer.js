(function(exports) {
	function Archer(game, x, y) {
		Troop.call(this, game, x, y, 'archer');
		this.commands = Archer.COMMANDS;
	}

	Archer.prototype = Object.create(Troop.prototype);
	Archer.prototype.constructor = Archer;

	Archer.COMMANDS = ['move', 'attack', 'defend', 'stop'];

	Archer.preload = function(load) {
		load.spritesheet('archer', 'assets/spritesheet/archer.png', 32, 32);
	}

	exports.Archer = Archer;
})(this);