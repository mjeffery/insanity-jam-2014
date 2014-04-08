(function(exports) {
	function Troop(game, x, y, key, bloodspray) {
		Unit.call(this, game, x, y, key);

		this.init();
		this.inputEnabled = true;

		this.createSelectBox(32, 32);
		this.createHealthBar();

		this.activity = 'none';
		this.dir = Phaser.NONE;
		this.blood = bloodspray;

		this.fall();
	}	

	Troop.SEEK_TOLERANCE = 4;
	Troop.WAIT_TOLERANCE = 24;

	Troop.CLOSE_ENOUGH_X = 300;
	Troop.CLOSE_ENOUGH_Y = 96;
	Troop.TOO_FAR_X = 400;

	Troop.WITHIN_ATTACK_RANGE = 24;
	Troop.ARROW_SPEED = 350;
	Troop.ARROW_GRAVITY = 450;
	Troop.ATTACK_DAMAGE = 20;
	Troop.TO_HIT_TIME = 200;
	Troop.COOLDOWN_TIME = 1300;

	Troop.prototype = Object.create(Unit.prototype);
	Troop.prototype.constructor = Troop;

	Mixin.humanoid(Troop.prototype);

	_.extend(Troop.prototype, {
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
					   Math.abs(this.x - this.target) < (this.seekTolerance || Troop.SEEK_TOLERANCE)
				   	) {
						//TODO make this into an "arrive" function to handle clustering?
						this.dir = Phaser.NONE;
						this.changeActivity('waiting');
						this.stand();
					}
					else if(
						this.activity !== 'patrolling' &&
						Math.abs(this.x - this.target) > (this.waitTolerance || Troop.WAIT_TOLERANCE)
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
							else if(this.onFloor() && this.withinRange(this.prey)) {
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
			var xLimit = this.closeEnoughX || Troop.CLOSE_ENOUGH_X,
				yLimit = this.closeEnoughY || Troop.CLOSE_ENOUGH_Y;

			return Math.abs(this.x - target.x) <= xLimit &&
				   Math.abs(this.y - target.y) <= yLimit;
		},

		tooFar: function(target) {
			var xLimit = this.tooFarX || Troop.TOO_FAR_X,
				yLimit = this.closeEnoughY || Troop.CLOSE_ENOUGH_Y;

			return Math.abs(this.x - target.x) >= xLimit &&
				   Math.abs(this.x - target.x) >= yLimit; 
		},

		withinRange: function(target) {
			var xLimit = this.withinAttackRange || Troop.WITHIN_ATTACK_RANGE;

			return Math.abs(target.x - this.x) <= xLimit &&
				   Math.abs(target.y - this.y) <= 2; 
		},

		attack: function(target) {
			this.nextActivity = 'patrolling';
			this.cooldown(Troop.COOLDOWN_TIME);
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
		
		damage: function(amount) {
			this.currHp -= amount;
			this.healthBar.setHp(this.currHp, this.maxHp);

			var x = this.x,
				y = this.y;

			//TODO play some damage sounds on a slight delay
			if(this.currHp <= 0) {
				this.blood.gush(x, y);
				this.kill();
				this.destroy();
			}
			else {
				this.blood.spray(x, y);
			}
		},

		seek: function(target) {
			this.target = target;
			this.changeActivity('seeking');
		},

		stop: function() {
			this.changeActivity('none');
			this.dir = Phaser.NONE;
			this.target = null;
		},

		onMessage: function(msg) {
			if(_.contains(this.commands, msg.command)) {
				switch(msg.command) {
					case 'move': this.seek(msg.target); break;
					case 'attack': this.patrol(msg.target); break;
					case 'stop': this.stop(); break;
				}
			}
		}
	});	

	exports.Troop = Troop;
})(this);