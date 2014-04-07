(function(exports) {
	function GravityField(game, x, y, dir) {
		Phaser.Sprite.call(this, game, x, y, 'gravity-field');
		this.game = game;
		this.dir = dir;

		this.game.physics.enable(this, Phaser.Physics.ARCADE);
		this.anchor.setTo(0.5, 0.5);
		this.alpha = 0.6;

		game.add.tween(this).to( { alpha: 0.2 }, 500, null, true, 0, Number.MAX_VALUE, true);
		game.time.events.add(GravityField.DURATION, this.destroy, this);
	}

	GravityField.prototype = Object.create(Phaser.Sprite.prototype);
	GravityField.prototype.constructor = GravityField;

	GravityField.DURATION = 3000;

	GravityField.preload = function(load) {
		load.image('gravity-field', 'assets/img/gravity field.png');	
	}

	GravityField.changeGravity = function(field, humanoid) {
		humanoid.changeGravity(field.dir);
	}

	_.extend(GravityField.prototype, {
		spawn: function() {
			if(!this.exists) return;

			var rnd = this.game.rnd,
				halfwidth = this.width / 2,
				x = rnd.realInRange(this.x - halfwidth, this.x + halfwidth),
				halfheight = this.height / 2,
				yoffset = this.dir === Phaser.UP ? this.y + 32 : this.y - 32,
				y = rnd.realInRange(yoffset - halfheight, yoffset + halfheight),
				wait = rnd.integerInRange(50, 300);

			this.effect.nextArrow(x, y, this.dir);

			this.game.time.events.add(wait, this.spawn, this);
		}
	});

	exports.GravityField = GravityField;
})(this);