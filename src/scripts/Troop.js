(function(exports) {
	function Troop(game, x, y, key) {
		Unit.call(this, game, x, y, key);

		this.animations.add('stand', [1]);
		this.animations.add('walk-left', [3, 4, 5, 4], Troop.WALK_RATE, true);
		this.animations.add('walk-right', [6, 7, 8, 7], Troop.WALK_RATE, true);
		this.animations.add('falling', [1, 4, 10, 7], Troop.FALL_RATE, true);

		this.animations.play('falling');

		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.anchor.setTo(0.5, 0.5);
		this.body.collideWorldBounds = true;
		this.body.acceleration.y = 350;
		this.inputEnabled = true;

		this.createSelectBox(32, 32);

		
	}	

	Troop.WALK_RATE = 6;
	Troop.FALL_RATE = 12;

	Troop.prototype = Object.create(Unit.prototype);
	Troop.prototype.constructor = Troop;

	Util.override(Troop.prototype, 'postUpdate', function() {
		this.__super();
		if(this.body.onFloor()) {
			this.animations.play('stand');
		}
		else {
			this.animations.play('falling');
		}
	});

	_.extend(Troop.prototype, {
		update: function() {

		},
		
		onMessage: function(msg) {

		}
	})	

	exports.Troop = Troop;
})(this);