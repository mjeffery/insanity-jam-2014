(function(exports) {
	function Archer(game, x, y, bloodspray) {
		Troop.call(this, game, x, y, 'archer', bloodspray);
		this.commands = Archer.COMMANDS;

		this.setHp(75, 75);
	}

	Archer.prototype = Object.create(Troop.prototype);
	Archer.prototype.constructor = Archer;

	Archer.COMMANDS = ['move', 'attack', 'defend', 'stop'];

	Archer.WAIT_TOLERANCE = 24;

	Archer.CLOSE_ENOUGH_X = 300;
	Archer.CLOSE_ENOUGH_Y = 96;
	Archer.TOO_FAR_X = 400;

	Archer.WITHIN_ATTACK_RANGE = 200;
	Archer.ARROW_SPEED = 350;
	Archer.ARROW_GRAVITY = 450;
	Archer.ATTACK_DAMAGE = 20;
	Archer.TO_HIT_TIME = 200;
	Archer.COOLDOWN_TIME = 1300;

	Archer.preload = function(load) {
		load.spritesheet('archer', 'assets/spritesheet/archer.png', 32, 32);
	}

	Mixin.create({
		think: function() {
			switch(this.activity) {
				case 'seeking': 
					if(Math.abs(this.x - this.target) < Troop.SEEK_TOLERANCE) {
						//TODO make this into an "arrive" function to handle clustering?
						this.dir = Phaser.NONE;
						this.changeActivity('none');
						this.stand();
					}
				break;

				case 'waiting':
				case 'patrolling':
					if(this.activity !== 'waiting' &&
					   Math.abs(this.x - this.target) < Troop.SEEK_TOLERANCE
				   	) {
						//TODO make this into an "arrive" function to handle clustering?
						this.dir = Phaser.NONE;
						this.changeActivity('waiting');
						this.stand();
					}
					else if(
						this.activity !== 'patrolling' &&
						Math.abs(this.x - this.target) > Archer.WAIT_TOLERANCE
					) {
						this.changeActivity('patrolling');
					}

					var foes = this.foes;
					if(foes) {
						var closest = Util.findClosest(this, foes);
						if(closest) {
							this.actualClosest = closest;
							if(this.closeEnough(closest.value)) { //TODO Add a visibility check
								this.prey = closest.value;
								this.changeActivity('attacking');
							}
						}
					}
				break;

				case 'attacking':
					if(this.prey) {
						if(this.prey.exists) {
							if(this.tooFar(this.prey)) {
								this.changeActivity('patrolling');
							}
							else if(this.body.onFloor() && this.withinRange(this.prey)) {
								this.attack(this.prey);
							}
						}
						else {
							this.prey = null;
							this.changeActivity("patrolling");
						}
					}
				break;
			}

			this.updateState();
		},

		destination: function() {
			switch(this.activity) {
				case 'patrolling':
				case 'seeking': 
					return this.target; 
				break;  
				case 'attacking': return this.prey.x; break;
			}
		},

		closeEnough: function(target) {
			return Math.abs(this.x - target.x) <= Archer.CLOSE_ENOUGH_X &&
				   Math.abs(this.y - target.y) <= Archer.CLOSE_ENOUGH_Y;
		},

		tooFar: function(target) {
			return Math.abs(this.x - target.x) >= Archer.TOO_FAR_X &&
				   Math.abs(this.x - target.x) >= Archer.CLOSE_ENOUGH_Y;
		},

		withinRange: function(target) {
			return Math.abs(target.x - this.x) <= Archer.WITHIN_ATTACK_RANGE &&
				   Math.abs(target.y - this.y) <= 2; 
		},

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

		//TODO there's a bug where you can cancel cooldowns
		//	   by issuing commands
		cooldown: function(time) {
			this.changeActivity('cooling down');
			this.stand();
			this.game.time.events.add(time, this.wakeUp, this);
		},

		wakeUp: function() {
			if(this.activity === 'cooling down')
				this.changeActivity(this.nextActivity || 'none');
		},

		patrol: function(target) {
			this.target = target;
			this.activity = 'patrolling';
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