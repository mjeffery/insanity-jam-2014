(function(exports) {
	function Soldier(game, x, y, bloodspray) {
		Troop.call(this, game, x, y, 'knight', bloodspray);
		this.commands = Soldier.COMMANDS;

		this.setHp(100, 100);
	}

	Soldier.prototype = Object.create(Troop.prototype);
	Soldier.prototype.constructor = Soldier;

	Soldier.COMMANDS = ['move', 'attack', 'stop'];
	Soldier.TO_HIT_TIME = 200;
	Soldier.ATTACK_DAMAGE = 10;
	Soldier.COOLDOWN_TIME = 600;

	Soldier.preload = function(load) {
		load.spritesheet('knight', 'assets/spritesheet/knight.png', 32, 32);
	}

	_.extend(Soldier.prototype, {
		attack: function(target) {
			var x = target.body.x,
				y = target.body.y;

			if(this.body.x < x) {
				this.dir = Phaser.RIGHT;
				this.animations.play('face-right'); 
			}
			else if(this.body.x > x) {
				this.dir = Phaser.LEFT;
				this.animations.play('face-left');
			}

			var slash = new SlashEffect(this.game, x + 16, y + 16, this.dir);
			this.game.add.existing(slash);

			//TODO play sound
			this.game.time.events.add(Soldier.TO_HIT_TIME, function() {
				this.prey.damage(Soldier.ATTACK_DAMAGE);
			}, this);

			this.nextActivity = 'patrolling';
			this.cooldown(Soldier.COOLDOWN_TIME);
		}
	});

	exports.Soldier = Soldier;
})(this);