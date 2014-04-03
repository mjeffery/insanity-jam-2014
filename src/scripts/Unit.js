(function(exports) {
	function Unit(game, x, y) {
		Phaser.Sprite.call(this, game, x, y, 'knight'); 
	
		this.animations.add('stand', [1]);
		this.animations.add('walk-left', [3, 4, 5, 4], Unit.WALK_RATE, true);
		this.animations.add('walk-right', [6, 7, 8, 7], Unit.WALK_RATE, true);
		this.animations.add('falling', [1, 4, 10, 7], Unit.FALL_RATE, true);

		this.animations.play('falling');

		var selectBox = this.selectBox = game.make.sprite(0, 0, '1x1-select-box');
		selectBox.anchor.setTo(0.5,0.5);
		selectBox.smoothed = false;
		selectBox.visible = false;
		this.addChild(selectBox);
	}

	Unit.WALK_RATE = 6;
	Unit.FALL_RATE = 12;

	Unit.preload = function(load) {
		load.spritesheet('knight', 'assets/spritesheet/knight.png', 32, 32);
		load.image('1x1-select-box', 'assets/img/1x1 selected.png');
	}

	Unit.prototype = Object.create(Phaser.Sprite.prototype);
	Unit.prototype.constructor = Unit;

	_.extend(Unit.prototype, {
	});

	Object.defineProperty(Unit.prototype, 'selected', {
		get: function() {
			return this.selectBox.visible;
		},
		set: function(val) {
			return this.selectBox.visible = !!val;
		}
	});

	exports.Unit = Unit;
})(this);