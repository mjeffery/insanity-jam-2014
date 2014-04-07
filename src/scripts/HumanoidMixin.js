(function(exports) {
	var mixin = {
		// Constants	
		WALK_RATE : 6,
		FALL_RATE : 12,
		DEFAULT_WALK_SPEED : 50,
		DEFAULT_JUMP_SPEED : -220,
		DEFAULT_GRAVITY: 350,

		// Must be called in the constructor
		init: function() {	
			this.animations.add('stand', [1]);
			this.animations.add('face-left', [4]);
			this.animations.add('face-right', [7]);
			this.animations.add('walk-left', [3, 4, 5, 4], mixin.WALK_RATE, true);
			this.animations.add('walk-right', [6, 7, 8, 7], mixin.WALK_RATE, true);
			this.animations.add('falling', [1, 4, 10, 7], mixin.FALL_RATE, true);

			this.animations.play('stand');

			game.physics.enable(this, Phaser.Physics.ARCADE);

			this.anchor.setTo(0.5, 0.5);
			this.body.collideWorldBounds = true;
			this.body.acceleration.y = 350;
			this.gravityDir = Phaser.DOWN;
		},

		onFloor: function() {
			switch(this.gravityDir) {
				case Phaser.DOWN: return this.body.onFloor();
				case Phaser.UP: return this.body.blocked.up;
			}
		},

		// must implement a function called 'destination', return undefined if no target exists,
		updateState: function() {
			switch(this.state) {
				case 'standing':
					if(this.onFloor()) {
						this.body.velocity.x = 0; //TODO control velocities?
						var destination = this.destination();
						if(destination !== undefined) {
							var dir = destination > this.body.x ? Phaser.RIGHT : Phaser.LEFT;
							this.walk(dir);
						}
					}
					else 
						this.fall();
				break;

				case 'walking': 
					if(this.onFloor()) {
						var dest = this.destination();
						if(dest !== undefined) {
							if(this.dir == Phaser.LEFT) {
								if(dest > this.x)
									this.walk(Phaser.RIGHT);
								else if(this.body.blocked.left)
									this.jump();
							} 
							else if(this.dir == Phaser.RIGHT) { 
								if(dest < this.x)
									this.walk(Phaser.LEFT);
								else if(this.body.blocked.right) 
									this.jump();
							}
						}
						else if(this.activity === 'none') { // take out the none?
							this.stand();
						}
					}
					else 
						this.fall();
				break;

				case 'falling':
					if(this.onFloor()) 
						this.stand();
				break;

				case 'jumping':
					if(
					   (this.gravityDir === Phaser.DOWN && this.body.velocity.y > 0) ||
					   (this.gravityDir === Phaser.UP && this.body.velocity.y < 0)
					){
						this.fall();
					}
					else {
						var dest = this.destination();
						if(dest !== undefined) {
							if(dest < this.x) this.left();
							else if(dest > this.y) this.right();
						}
					}
				break;

				case 'cooldown':
					break;
			}
		},

		jump: function() {
			this.changeState('jumping');
			var speed = this.jumpSpeed || mixin.DEFAULT_JUMP_SPEED;
			this.body.velocity.y = this.gravityDir === Phaser.DOWN ? speed : -speed; 
		},

		left: function() {
			this.body.velocity.x = -(this.walkSpeed || mixin.DEFAULT_WALK_SPEED);
			this.dir = Phaser.LEFT;
		},

		right: function() {
			this.dir = Phaser.RIGHT;
			this.body.velocity.x = this.walkSpeed || mixin.DEFAULT_WALK_SPEED;
		},

		stand: function() {
			this.changeState('standing');
			switch(this.dir) {
				case Phaser.LEFT: this.animations.play('face-left'); break;
				case Phaser.RIGHT: this.animations.play('face-right'); break;
				default: this.animations.play('stand'); break;
			}
		},

		fall: function() {
			this.changeState('falling');
			//this.animations.play('falling');
		},

		walk: function(dir) {
			switch(dir) {
				case Phaser.LEFT:
					this.changeState('walking');
					this.animations.play('walk-left');
					this.left();
				break;
				case Phaser.RIGHT:
					this.changeState('walking');
					this.animations.play('walk-right');
					this.right();
				break;
			}
		},

		changeGravity: function(dir) {
			if(this.gravityDir != dir) {
				this.gravityDir = dir;
				this.game.time.events.add(300, function() {
					this.body.acceleration.y = dir === Phaser.DOWN ? this.DEFAULT_GRAVITY : - this.DEFAULT_GRAVITY;
					this.scale.y = -this.scale.y; //flip!
				}, this);
			}
		},

		changeState: function(newState) {
			this.prevState = this.state;
			if(newState != this.state) {
				if(this.onExitState) this.onExitState(this.state);
				if(this.onEnterState) this.onEnterState(newState);
			}
			this.state = newState; 
		},

		changeActivity: function(newActivity) {
			this.prevActivity = this.activity;
			if(newActivity !== this.activity) {
				if(this.onStopActivity) this.onStopActivity(newActivity);
				if(this.onStartActivity) this.onStartActivity(newActivity);
			}
			this.activity = newActivity;
		}
	}

	exports.Mixin.humanoid = Mixin.create(mixin);	
})(this);