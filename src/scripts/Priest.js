(function(exports) {
	function Priest(game, x, y) {
		Troop.call(this, game, x, y, 'priest');
		this.commands = Priest.COMMANDS;
	}

	Priest.prototype = Object.create(Troop.prototype);
	Priest.prototype.constructor = Priest;

	Priest.COMMANDS = ['move', 'stop']; //TODO add spellcast 

	Priest.preload = function(load) {
		load.spritesheet('priest', 'assets/spritesheet/priest.png', 32, 32);
	}

	exports.Priest = Priest;
})(this);