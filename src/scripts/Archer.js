(function(exports) {
	function Archer(game, x, y, bloodspray) {
		Troop.call(this, game, x, y, 'archer', bloodspray);
		this.commands = Archer.COMMANDS;

		this.setHp(75, 75);
	}

	Archer.prototype = Object.create(Troop.prototype);
	Archer.prototype.constructor = Archer;

	Archer.COMMANDS = ['move', 'attack', 'defend', 'stop'];

	Archer.preload = function(load) {
		load.spritesheet('archer', 'assets/spritesheet/archer.png', 32, 32);
	}

	exports.Archer = Archer;
})(this);