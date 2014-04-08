(function(exports) {
	function Backdrop(game) {
		Phaser.Sprite.call(this, game, 0, 0, 'invisible'); //need a more appropriate image...
		this.width = game.world.width;
		this.height = game.world.height;
		this.inputEnabled = true;
		this.fixedToCamera = true;
	}

	Backdrop.preload = function(load) {
		load.image('invisible', 'assets/img/transparent white.png');
	}

	Backdrop.prototype = Object.create(Phaser.Sprite.prototype);
	Backdrop.prototype.constructor = Backdrop;

	exports.Backdrop = Backdrop;
})(this);