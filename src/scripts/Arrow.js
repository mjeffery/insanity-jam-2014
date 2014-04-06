(function(exports) {
	function Arrow(game, x, y, attackDamage) {
		this.attackDamage = attackDamage || Archer.ATTACK_DAMAGE;

		Phaser.Sprite.call(this, game, x, y, 'arrow');
		this.anchor.setTo(0.5, 0.5);

		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.setSize(16, 5, 0, 5);
		this.body.collideWorldBounds = true;
		this.body.bounce.set(0.3);
	}

	Arrow.prototype = Object.create(Phaser.Sprite.prototype);
	Arrow.prototype.constructor = Arrow;

	Arrow.FADE_TIME = 2500;

	Util.override(Arrow.prototype, 'reset', function(x, y) {
		this.__super(x,y);
		this.body.collideWorldBounds = true;
		this.outOfBoundsKill = false;
		this.checkOutOfBounds = false;
		this.ghosted = false;	
		for(var key in this.body.checkCollision)
			this.body.checkCollision[key] = true;
	});

	Arrow.preload = function(load) {
		load.image('arrow', 'assets/img/arrow.png');
	}

	Arrow.processWorld = function(arrow) {
		return !arrow.ghosted; 
	}

	Arrow.collideWorld = function(arrow, world) {
		arrow.ghosted = true;
		arrow.outOfBoundsKill = true;
		arrow.checkOutOfBounds = true;
		for(var key in arrow.body.checkCollision)
			arrow.body.checkCollision[key] = false;
	}

	Arrow.collideOrc = function(arrow, orc) {
			orc.damage(arrow.attackDamage);
			arrow.kill();
	}

	_.extend(Arrow.prototype, {
		update: function() {
			var vel = this.body.velocity;
			this.rotation = Math.atan2(vel.y, vel.x);
		}
	});

	exports.Arrow = Arrow;
})(this);