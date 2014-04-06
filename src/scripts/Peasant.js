(function(exports) {
	
	function Peasant(game, x, y, bloodspray) {
		Troop.call(this, game, x, y, 'peasant', bloodspray);
		this.commands = Peasant.COMMANDS;
		this.setHp(40, 40);
	}

	Peasant.prototype = Object.create(Troop.prototype);
	Peasant.prototype.constructor = Peasant;

	Peasant.COMMANDS = ['move', 'stop'];

	Peasant.preload = function(load) {
		load.spritesheet('peasant', 'assets/spritesheet/peasant.png', 32, 32);
	}

	exports.Peasant = Peasant;
})(this);