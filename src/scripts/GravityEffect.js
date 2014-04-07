(function(exports) {
	function SpellArrow(game, x, y, dir) {
		this.dir = dir;
		Phaser.Sprite.call(this, game, x, y, 'spell-arrow');
		this.anchor.setTo(0.5, 1);
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.animations.add('flutter', [0, 1], 8);
	}

	SpellArrow.prototype = Object.create(Phaser.Sprite.prototype);
	SpellArrow.prototype.constructor = SpellArrow;

	SpellArrow.GRAVITY = 200;

	_.extend(SpellArrow.prototype, {
		init: function() {
			var rnd = this.game.rnd,
				scale = rnd.realInRange(0.25, 1);

			this.scale.x = scale;
			this.scale.y = scale;

			if(this.dir === Phaser.DOWN) {
				this.scale.y *= -1;
				this.body.acceleration.y = SpellArrow.GRAVITY;
			}
			else {
				this.body.acceleration.y = -SpellArrow.GRAVITY;
			}

			this.animations.play('flutter');

			this.alpha = 0;
			this.game.add.tween(this)
				.to({ alpha: .6}, 300)
				.to({ alpha: .6}, 1000)
				.to({ alpha: 0}, 150)
				.start();
				//.onComplete.add(this.kill, this);
			this.game.time.events.add(1450, this.kill, this);
		}
	});

	Util.override(SpellArrow.prototype, 'reset', function(x, y) {
		this.__super(x, y);
		this.init();
	});

	function GravityEffect(game) {
		Phaser.Group.call(this, game);

		for(var i = 0; i < 100; i++) {
			var arrow = new SpellArrow(this.game, 0, 0, Phaser.NONE);
			this.add(arrow);
			arrow.kill();
		}
	}

	GravityEffect.prototype = Object.create(Phaser.Group.prototype);
	GravityEffect.prototype.constructor = GravityEffect;

	GravityEffect.preload = function(load) {
		load.spritesheet('spell-arrow', 'assets/spritesheet/spell arrows.png', 32, 64);
	}

	_.extend(GravityEffect.prototype, {
		nextArrow: function(x, y, dir) {
			var arrow = this.getFirstDead();
			arrow.dir = dir;
			arrow.reset(x, y);

			return arrow;
		}
	});

	exports.GravityEffect = GravityEffect;
})(this);