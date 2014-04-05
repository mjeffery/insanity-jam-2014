(function(exports) {
	function Unit(game, x, y, key) {
		Phaser.Sprite.call(this, game, x, y, key); 
	}

	Unit.preload = function(load) {
		load.image('1x1-select-box', 'assets/img/1x1 selected.png');
	}

	Unit.prototype = Object.create(Phaser.Sprite.prototype);
	Unit.prototype.constructor = Unit;

	_.extend(Unit.prototype, {
		createSelectBox: function(w, h) {
			//TODO ignoring params for now... 
			var selectBox = this.selectBox = game.make.sprite(0, 0, '1x1-select-box');
			selectBox.anchor.setTo(0.5,0.5);
			selectBox.smoothed = false;
			selectBox.visible = false;
			this.addChild(selectBox);
		},

		createHealthBar: function() {
			var y = this.height / 2;
			var healthBar = this.healthBar = new HealthBar(this.game, 0, -y);
			healthBar.anchor.setTo(0.5, 1);
			healthBar.smoothed = false;
			healthBar.visible = false;
			this.addChild(healthBar);
		},

		setHp: function(curr, max) {
			if(max !== undefined)
				this.maxHp = Math.max(1, max);
			this.currHp = Math.min(curr || 0, this.maxHp);
			this.healthBar.setHp(this.currHp, this.maxHp);
		},

		send: function(msg) {
			if(this.onMessage) 
				this.onMessage(msg);
		},

		onMessage: function(msg) {
			console.log(msg);
		}
	});

	Object.defineProperty(Unit.prototype, 'selected', {
		get: function() {
			return this.selectBox.visible;
		},
		set: function(val) {
			return this.healthBar.visible = this.selectBox.visible = !!val;
		}
	});

	exports.Unit = Unit;
})(this);