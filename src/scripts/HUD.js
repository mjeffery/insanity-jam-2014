(function(exports) {
	function HUD(game) {
		Phaser.Group.call(this, game); // not pefect, but it works...
	
		this.peasantCount = 0;

		game.make.image('peasants-icon')
	}

	HUD.prototype = Object.create(Phaser.Group.prototype);
	HUD.prototype.constructor = HUD;

	HUD.preload = function(load) {
		load.image('peasants-icon', 'assets/img/peasants icon.png');
	}

	_.extend(HUD.prototype, {
		onSpawn: function(unit) {
			if(unit instanceof Peasant) {
				console.log('peasant!');
			}
		}
	});

	exports.HUD = HUD;
})(this);