(function(exports) {

	function humanoidMixin(prototype) {
		for(var key in mixin) {
			if(!mixin.hasOwnProperty(key)) continue;
			var prop = mixin[key];
			if(prototype[key] && typeof(prop) === 'function')
				Util.override(prototype, key, prop);
			else
				prototype[key] = prop;
		}
	}

	humanoidMixin.WALK_RATE = 6;
	humanoidMixin.FALL_RATE = 12;
	humanoidMixin.DEFAULT_WALK_SPEED = 50;
	humanoidMixin.DEFAULT_JUMP_SPEED = -220;

	var mixin = {
		// Must be called in the constructor
		init: function() {	
			this.animations.add('stand', [1]);
			this.animations.add('face-left', [0]);
			this.animations.add('face-right', [2]);
			this.animations.add('walk-left', [3, 4, 5, 4], humanoidMixin.WALK_RATE, true);
			this.animations.add('walk-right', [6, 7, 8, 7], humanoidMixin.WALK_RATE, true);
			this.animations.add('falling', [1, 4, 10, 7], humanoidMixin.FALL_RATE, true);

			this.animations.play('stand');

			game.physics.enable(this, Phaser.Physics.ARCADE);

			this.anchor.setTo(0.5, 0.5);
			this.body.collideWorldBounds = true;
			this.body.acceleration.y = 350;
		},

		jump: function() {
			this.state = 'jumping';
			this.body.velocity.y = this.jumpSpeed || humanoidMixin.DEFAULT_JUMP_SPEED;
		},

		left: function() {
			this.body.velocity.x = -(this.walkSpeed || humanoidMixin.DEFAULT_WALK_SPEED);
			this.dir = 'left';
		},

		right: function() {
			this.dir = 'right';
			this.body.velocity.x = this.walkSpeed || humanoidMixin.DEFAULT_WALK_SPEED;
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
	}

	if(!exports.Mixin) exports.Mixin = {};
	exports.Mixin.humanoid = humanoidMixin;	
})(this);