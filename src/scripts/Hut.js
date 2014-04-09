(function(exports) {
	function Hut(game, x, y, humans, fogOfWar, spawn, units) {
		Phaser.Sprite.call(this, game, x, y, 'hut');
		this.anchor.setTo(0.5, 0.5);

		this.units = units || [];
		this.humans = humans;
		this.fog = fogOfWar;
		this.spawn = spawn;
		this.revealed = false;
	}

	Hut.prototype = Object.create(Phaser.Sprite.prototype);
	Hut.prototype.constructor = Hut;

	Hut.ACTIVATION_RADIUS = 80;

	Hut.preload = function(load) {
		load.image('hut', 'assets/img/hut.png');
	}

	_.extend(Hut.prototype, {
		update: function() {
			if(!this.revealed) {
				var closest = Util.findClosest(this, this.humans);
				if(closest && closest.distance <= Hut.ACTIVATION_RADIUS) {
					this.fog.reveal(this);
					this.revealed = true;
					this.game.time.events.add(500, function() {
						var count = this.units.length,
							spawn = this.spawn,
							halfCount = Math.ceil(count / 2),
							left = this.x - 16 * halfCount,
							x, y, unit;

						for(var i = 0; i < count; i++) {
							x = left + i * 32;
							y = this.y; 

							switch(this.units[i]) {
								case 'priest': unit = spawn.priest(x, y, true); break;
								case 'soldier': unit = spawn.soldier(x, y, true); break;
								case 'archer': unit = spawn.archer(x, y, true); break;
								case 'peasant': unit = spawn.peasant(x, y, true); break;
								case 'orc': unit = spawn.orc(x, y, true); break;
							}
							if(unit.team === 'human')
								this.fog.track(unit);
						} 
					}, this);
				}
			}
		}
	});

	exports.Hut = Hut;
})(this);