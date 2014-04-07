(function(exports) {
	function Archer(game, x, y, bloodspray) {
		Troop.call(this, game, x, y, 'archer', bloodspray);
		this.commands = Archer.COMMANDS;

		this.setHp(75, 75);

		this.withinAttackRange = Archer.WITHIN_ATTACK_RANGE;
		this.cooldownTime = Archer.COOLDOWN_TIME; 
	}

	Archer.prototype = Object.create(Troop.prototype);
	Archer.prototype.constructor = Archer;

	Archer.COMMANDS = ['move', 'attack', 'defend', 'stop'];

	Archer.WITHIN_ATTACK_RANGE = 200;
	Archer.ARROW_SPEED = 350;
	Archer.ARROW_GRAVITY = 450;
	Archer.ATTACK_DAMAGE = 20;
	Archer.COOLDOWN_TIME = 1300;

	Archer.preload = function(load) {
		load.spritesheet('archer', 'assets/spritesheet/archer.png', 32, 32);
	}

	Mixin.create({
		attack: function(target) {
			var game = this.game,
				x = target.x,
				y = target.y;

			if(this.x < x) {
				this.dir = Phaser.RIGHT;
				this.animations.play('face-right');
			}
			else if(this.x > x) {
				this.dir = Phaser.LEFT;
				this.animations.play('face-left');
			}

			var theta = Util.lobAtPoint(this, target, Archer.ARROW_SPEED, Archer.ARROW_GRAVITY);
			if(theta !== undefined) {
				var arrow = this.arrows.getArrow(this.x, this.y);
				arrow.body.acceleration.y = Archer.ARROW_GRAVITY;

				theta = game.rnd.pick(theta);
				game.physics.arcade.velocityFromRotation(theta, Archer.ARROW_SPEED, arrow.body.velocity);
			}
			
			this.nextActivity = 'patrolling';
			this.cooldown(Archer.COOLDOWN_TIME);
		},

		onMessage: function(msg) {
			switch(msg.command) {
				case 'move': this.seek(msg.target); break;
				case 'attack': this.patrol(msg.target); break;
				case 'stop': this.stop(); break;
			}
		}

	})(Archer.prototype);

	exports.Archer = Archer;
})(this);