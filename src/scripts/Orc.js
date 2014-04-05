(function(exports) {
	function Orc(game, x, y, sex) {
		var key = (sex === Orc.MALE ? 'male-orc' : 'female-orc'); 
		Phaser.Sprite.call(this, game, x, y, key);

		this.animations.add('stand', [1]);
		this.animations.add('face-left', [0]);
		this.animations.add('face-right', [2]);
		this.animations.add('walk-left', [3, 4, 5, 4], Troop.WALK_RATE, true);
		this.animations.add('walk-right', [6, 7, 8, 7], Troop.WALK_RATE, true);

		this.animations.play('stand');

		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.anchor.setTo(0.5, 0.5);
		this.body.collideWorldBounds = true;
		this.body.acceleration.y = 350;

		this.activity = "none";
		this.state = "none";

		this.fall();
	}

	Orc.prototype = Object.create(Phaser.Sprite.prototype);
	Orc.prototype.constructor = Orc;

	Orc.MALE = 'male';
	Orc.FEMALE = 'female';
	Orc.WALK_RATE = 6;
	Orc.CLOSE_ENOUGH_X = 300;
	Orc.CLOSE_ENOUGH_Y = 96;

	Orc.preload = function(load) {
		load.spritesheet('male-orc', 'assets/spritesheet/gentleman orc.png', 32, 32);
		load.spritesheet('female-orc', 'assets/spritesheet/lady orc.png', 32, 32);
	}

	_.extend(Orc.prototype, {
		think: function() {
			var foes = this.foes;

			if(foes) {
				var closest = Util.findClosest(this, foes); 
				if(closest) {
					if(Math.abs(this.body.x - closest.value.x) <= Orc.CLOSE_ENOUGH_X &&
					   Math.abs(this.body.y - closest.value.y) <= Orc.CLOSE_ENOUGH_Y)
					{
						//TODO 
						this.prey = closest.value;
					}
				}
			}

			switch(this.state) {
				case 'falling': 
					if(this.body.onFloor()) 
						this.stand();
					else {

					}
				break;

				case 'standing': 
				break;
			}
		},

		fall: function() {
			this.state = 'falling';
		},

		stand: function() {
			this.animations.play('stand');
			this.body.velocity.x = 0;
			this.state = 'standing';
		}
	});

	exports.Orc = Orc;
})(this);