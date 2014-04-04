(function(exports) {
	function Troop(game, x, y, key) {
		Unit.call(this, game, x, y, key);

		this.animations.add('stand', [1]);
		this.animations.add('walk-left', [3, 4, 5, 4], Troop.WALK_RATE, true);
		this.animations.add('walk-right', [6, 7, 8, 7], Troop.WALK_RATE, true);
		this.animations.add('falling', [1, 4, 10, 7], Troop.FALL_RATE, true);

		this.animations.play('stand');

		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.anchor.setTo(0.5, 0.5);
		this.body.collideWorldBounds = true;
		this.body.acceleration.y = 350;
		this.inputEnabled = true;

		this.createSelectBox(32, 32);

		this.activity = 'none';
		this.dir = 'none';

		this.fall();

		var key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		key.onDown.add(function() {
			if(this.state != 'jumping' && this.state != 'falling') {
				this.jump();
			}
		}, this);
	}	

	Troop.WALK_RATE = 6;
	Troop.FALL_RATE = 12;
	Troop.DEFAULT_WALK_SPEED = 50;
	Troop.DEFAULT_JUMP_SPEED = -220;
	Troop.SEEK_TOLERANCE = 4;

	Troop.prototype = Object.create(Unit.prototype);
	Troop.prototype.constructor = Troop;

	_.extend(Troop.prototype, {
		think: function() {
			switch(this.activity) {
				case 'seeking':
					if(Math.abs(this.target - this.body.x) < Troop.SEEK_TOLERANCE) {
						//TODO fire a nudge bullet for spacing?
						this.stand();
						this.activity = 'none';
					}
				break;
			}

			switch(this.state) {
				case 'standing':
					if(this.body.onFloor()) {
						this.body.velocity.x = 0; //TODO control velocities?
						if(this.activity == 'seeking') {
							var dir = this.target > this.body.x ? 'right' : 'left';
							this.walk(dir);
						}
					}
					else 
						this.fall();
				break;

				case 'walking': 
					if(this.body.onFloor()) {
						if(this.activity === 'seeking') {
							if(this.dir == 'left') {
								if(this.target > this.body.x)
									this.walk('right');
								else if(this.body.blocked.left)
									this.jump();
							} 
							else if(this.dir == 'right') { 
								if(this.target < this.body.x)
									this.walk('left');
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
						if(this.activity === 'seeking') {
							if(this.target < this.body.x) this.left();
							else if(this.target > this.body.y) this.right();
						}
					}

				break;
			}
		},

		seek: function(target) {
			this.target = target;
			this.activity = 'seeking';
		},

		stand: function() {
			this.state = 'standing';
			this.animations.play('stand');
			this.dir = 'none';
		},

		fall: function() {
			this.state = 'falling';
			//this.animations.play('falling');
		},

		walk: function(dir) {
			switch(dir) {
				case 'left':
					this.state = 'walking';
					this.animations.play('walk-left');
					this.left();
				break;
				case 'right':
					this.state = 'walking';
					this.animations.play('walk-right');
					this.right();
			}
		},

		jump: function() {
			this.state = 'jumping';
			this.body.velocity.y = this.jumpSpeed || Troop.DEFAULT_JUMP_SPEED;
		},

		left: function() {
			this.body.velocity.x = -(this.walkSpeed || Troop.DEFAULT_WALK_SPEED);
			this.dir = 'left';
		},

		right: function() {
			this.dir = 'right';
			this.body.velocity.x = this.walkSpeed || Troop.DEFAULT_WALK_SPEED;
		},

		onMessage: function(msg) {
			if(msg.target) this.seek(msg.target);
			if(msg.command === 'stop') {
				this.activity = 'none';
				this.target = null;
			}
		}
	});	

	exports.Troop = Troop;
})(this);