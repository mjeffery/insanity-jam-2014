(function(exports) {
	var mixin = {
		// Constants	
		WALK_RATE : 6,
		FALL_RATE : 12,
		DEFAULT_WALK_SPEED : 50,
		DEFAULT_JUMP_SPEED : -220,

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
		},

		setHp: function(curr, max) {
			if(max !== undefined)
				this.maxHp = Math.max(1, max);
			this.currHp = Math.min(curr || 0, this.maxHp);
			this.healthBar.setHp(this.currHp, this.maxHp);
		},

		// must implement a function called 'destination', return undefined if no target exists,
		updateState: function() {
			switch(this.state) {
				case 'standing':
					if(this.body.onFloor()) {
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
					if(this.body.onFloor()) {
						var dest = this.destination();
						if(dest !== undefined) {
							if(this.dir == Phaser.LEFT) {
								if(dest > this.body.x)
									this.walk(Phaser.RIGHT);
								else if(this.body.blocked.left)
									this.jump();
							} 
							else if(this.dir == Phaser.RIGHT) { 
								if(dest < this.body.x)
									this.walk(Phaser.LEFT);
								else if(this.body.blocked.right) 
									this.jump();
							}
						}
						else if(this.activity === 'none') {
							this.stand();
						}
					}
					else 
						this.fall();
				break;

				case 'falling':
					if(this.body.onFloor()) 
						this.stand();
				break;

				case 'jumping':
					if(this.body.velocity.y > 0)
						this.fall();
					else {
						var dest = this.destination();
						if(dest !== undefined) {
							if(dest < this.body.x) this.left();
							else if(dest > this.body.y) this.right();
						}
					}
				break;
			}
		},

		jump: function() {
			this.state = 'jumping';
			this.body.velocity.y = this.jumpSpeed || mixin.DEFAULT_JUMP_SPEED;
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
			this.state = 'standing';
			switch(this.dir) {
				case Phaser.LEFT: this.animations.play('face-left'); break;
				case Phaser.RIGHT: this.animations.play('face-right'); break;
				default: this.animations.play('stand'); break;
			}
		},

		fall: function() {
			this.state = 'falling';
			//this.animations.play('falling');
		},

		walk: function(dir) {
			switch(dir) {
				case Phaser.LEFT:
					this.state = 'walking';
					this.animations.play('walk-left');
					this.left();
				break;
				case Phaser.RIGHT:
					this.state = 'walking';
					this.animations.play('walk-right');
					this.right();
			}
		},
	}

	exports.Mixin.humanoid = Mixin.create(mixin);	
})(this);