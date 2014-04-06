(function(exports) {
	function Orc(game, x, y, sex) {
		var key = (sex === Orc.MALE ? 'male-orc' : 'female-orc'); 
		Phaser.Sprite.call(this, game, x, y, key);

		this.init();

		this.activity = "none";
		this.state = "none";

		this.fall();
	}

	Orc.prototype = Object.create(Phaser.Sprite.prototype);
	Orc.prototype.constructor = Orc;

	Orc.MALE = 'male';
	Orc.FEMALE = 'female';
	Orc.CLOSE_ENOUGH_X = 300;
	Orc.CLOSE_ENOUGH_Y = 96;
	Orc.WITHIN_ATTACK_RANGE = 24;
	Orc.ATTACK_DAMAGE = 40;
	Orc.TO_HIT_TIME = 200;
	Orc.COOLDOWN_TIME = 1000;


	Orc.preload = function(load) {
		load.spritesheet('male-orc', 'assets/spritesheet/gentleman orc.png', 32, 32);
		load.spritesheet('female-orc', 'assets/spritesheet/lady orc.png', 32, 32);
	}

	Mixin.humanoid(Orc.prototype);

	_.extend(Orc.prototype, {

		setHp: function(curr, max) {
			if(max !== undefined)
				this.maxHp = Math.max(1, max);
		},

		think: function() {
			var foes = this.foes;

			//TODO don't run this every frame, its not necessary...
			//detect nearby humans & buildings
			if(foes && this.activity !== 'cooling down') {
				var closest = Util.findClosest(this, foes); 
				if(closest) {
					this.actualClosest = closest;
					if(Math.abs(this.body.x - closest.value.x) <= Orc.CLOSE_ENOUGH_X &&
					   Math.abs(this.body.y - closest.value.y) <= Orc.CLOSE_ENOUGH_Y)
					{
						if(this.activity == 'hunting') {
							//is current prey too far away?
							//determine if a target switch makes sense
						}
						else {
							this.prey = closest.value;
							this.activity = 'hunting';
						}
					}
				}
			}

			switch(this.activity) {
				case 'hunting': 
					if(this.prey) {
						if(this.prey.exists) {
							if(this.body.onFloor() && this.withinRange(this.prey)) {	
								this.attack();
							}
						}
						else {
							this.prey = null;
							this.activity = "none";
						}
					}	
					else {
						console.log('error: hunting nothing');
						this.activity = 'none';
					}
				break;
			}

			this.updateState();
		},

		destination: function() {
			if(this.activity === 'hunting') {
				if(this.prey) return this.prey.x;
				else {
					this.activity = 'none';
					console.log('error: hunting nothing')
				}
			}

			return undefined;
		},

		withinRange: function(target) {
			return Math.abs(target.x - this.x) <= Orc.WITHIN_ATTACK_RANGE &&
				   Math.abs(target.y - this.y) <= 2; 
		},

		attack: function() {
			if(this.prey) {
				var x = this.prey.body.x,
					y = this.prey.body.y;

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
				this.game.time.events.add(Orc.TO_HIT_TIME, function() {
					this.prey.damage(Orc.ATTACK_DAMAGE);
				}, this);

				this.cooldown(Orc.COOLDOWN_TIME);
			}
			else {
				if(this.activity === 'attacking') this.activity = "none";
				console.log("error: attacking nothing");
			}
		},

		cooldown: function(time) {
			this.activity = "cooling down";
			this.stand();

			this.game.time.events.add(time, this.wakeUp, this);
		},

		wakeUp: function() {
			if(this.activity === 'cooling down')
				this.activity = 'none';
		}
	});

	exports.Orc = Orc;
})(this);