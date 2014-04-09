(function(exports) {
	function Orc(game, x, y, sex) {
		var key = (sex === Orc.MALE ? 'male-orc' : 'female-orc'); 
		Phaser.Sprite.call(this, game, x, y, key);
		this.setHp(100, 100);

		this.init();

		this.activity = "none";
		this.state = "none";
		this.walkSpeed = 60;

		this.fall();
	}

	Orc.prototype = Object.create(Phaser.Sprite.prototype);
	Orc.prototype.constructor = Orc;

	Orc.MALE = 'male';
	Orc.FEMALE = 'female';

	Orc.CLOSE_ENOUGH_X = 200;
	Orc.CLOSE_ENOUGH_Y = 96;
	Orc.TOO_FAR_X = 400;

	Orc.WITHIN_ATTACK_RANGE = 24;
	Orc.ATTACK_DAMAGE = 40;
	Orc.COOLDOWN_TIME = 1000;
	Orc.TO_HIT_TIME = 200;

	Orc.preload = function(load) {
		load.spritesheet('male-orc', 'assets/spritesheet/gentleman orc.png', 32, 32);
		load.spritesheet('female-orc', 'assets/spritesheet/lady orc.png', 32, 32);
	}

	Mixin.humanoid(Orc.prototype);

	_.extend(Orc.prototype, {

		setHp: function(curr, max) {
			if(max !== undefined)
				this.maxHp = Math.max(1, max);
			this.currHp = Math.min(this.maxHp, curr);
		},

		think: function() {
			var foes = this.foes;

			//TODO don't run this every frame, its not necessary...
			//detect nearby humans & buildings
			if(foes && this.activity !== 'cooling down') {
				var closest = Util.findClosest(this, foes); 
				if(closest) {
					this.actualClosest = closest;
					if(this.closeEnough(closest.value) && this.activity !== 'hunting') {
						this.prey = closest.value;
						this.changeActivity('hunting');
					}
				}
			}

			switch(this.activity) {
				case 'hunting': 
					if(this.prey) {
						if(this.prey.exists) {
							if(this.tooFar(this.prey)) {
								this.changeActivity("none");
								this.stand();
							} 
							else {
								if(this.onFloor() && this.withinRange(this.prey)) {	
									this.attack();
								}
							}
						}
						else {
							this.prey = null;
							this.changeActivity("none");
						}
					}	
					else {
						console.log('error: hunting nothing');
						this.changeActivity('none');
					}
				break;
			}

			this.updateState();
		},

		destination: function() {
			if(this.activity === 'hunting') {
				if(this.prey) return this.prey.x;
				else {
					this.changeActivity('none');
					console.log('error: hunting nothing')
				}
			}

			return undefined;
		},

		closeEnough: function(target) {
			return Math.abs(this.x - target.x) <= Orc.CLOSE_ENOUGH_X &&
				   Math.abs(this.y - target.y) <= Orc.CLOSE_ENOUGH_Y;
		},

		tooFar: function(target) {
			var dx = Math.abs(this.x - target.x), 
				dy = Math.abs(this.y - target.y);

				return (dx <= Troop.SEEK_TOLERANCE && 
						dy >= 16) ||
						(dx >= Orc.TOO_FAR_X &&
						 dy >= Orc.CLOSE_ENOUGH_Y);
		},

		withinRange: function(target) {
			return Math.abs(target.x - this.x) <= Orc.WITHIN_ATTACK_RANGE &&
				   Math.abs(target.y - this.y) <= 2; 
		},

		attack: function() {
			if(this.prey) {
				var x = this.prey.x,
					y = this.prey.y;

				if(this.x < x) {
					this.dir = Phaser.RIGHT;
					this.animations.play('face-right'); 
				}
				else if(this.x > x) {
					this.dir = Phaser.LEFT;
					this.animations.play('face-left');
				}

				var slash = new SlashEffect(this.game, x,  y, this.dir);
				this.game.add.existing(slash);

				//TODO play sound
				this.game.time.events.add(Orc.TO_HIT_TIME, function() {
					this.prey.damage(Orc.ATTACK_DAMAGE);
				}, this);

				this.cooldown(Orc.COOLDOWN_TIME);
			}
			else {
				this.changeActivity("none");
				console.log("error: attacking nothing");
			}
		},

		cooldown: function(time) {
			this.changeActivity("cooling down");
			this.stand();

			this.game.time.events.add(time, this.wakeUp, this);
		},

		wakeUp: function() {
			if(this.activity === 'cooling down')
				this.changeActivity('none');
		},

		damage: function(amount) {
			if(!this.exists) return;
			
			this.currHp -= amount;

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
		}
	});

	Object.defineProperty(Orc.prototype, 'team', { value: 'orc' });

	exports.Orc = Orc;
})(this);