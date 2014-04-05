(function(exports) {
	function HealthBar(game, x, y) {
		Phaser.Sprite.call(this, game, x, y, 'health-bar');
		this.frame = 0;
	}

	HealthBar.prototype = Object.create(Phaser.Sprite.prototype);
	HealthBar.prototype.constructor = HealthBar;

	HealthBar.preload = function(load) {
		load.spritesheet('health-bar', 'assets/spritesheet/health bar.png', 32, 8);
	}

	_.extend(HealthBar.prototype, {
		setHp: function(curr, max) {
			var percent = curr / max;
			if(percent <= 0.25) this.frame = 3;
			else if(percent <= 0.50) this.frame = 2;
			else if(percent <= 0.75) this.frame = 1;
			else this.frame = 0; 
		}
	});

	exports.HealthBar = HealthBar;
})(this);