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
			return this.selectBox.visible = !!val;
		}
	});

	exports.Unit = Unit;
})(this);