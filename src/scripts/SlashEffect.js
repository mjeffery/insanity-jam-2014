(function(exports) {
	function SlashEffect(game, x, y, dir) {
		Phaser.Sprite.call(this, game, x, y, 'slash-effect');
		
		this.anchor.setTo(0.5, 0.5);
		if(dir === Phaser.RIGHT) this.scale.x = -1;

		this.animations.add('slash', [0, 1, 2, 3], 10);
		this.animations.play('slash', null, false, true);
	}

	SlashEffect.prototype = Object.create(Phaser.Sprite.prototype);
	SlashEffect.prototype.constructor = SlashEffect;

	SlashEffect.preload = function(load) {
		load.spritesheet('slash-effect', 'assets/spritesheet/slash.png', 32, 32);
	}

	exports.SlashEffect = SlashEffect;
})(this);