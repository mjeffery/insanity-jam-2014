(function(exports) {
	function ArrowGroup(game, count) {
		if(count === undefined) count = 100;

		Phaser.Group.call(this, game);

		for(var i = 0; i < count; i++) {
			var arrow = new Arrow(game, 0, 0);
			this.add(arrow);
			arrow.kill();
		}
	}

	ArrowGroup.prototype = Object.create(Phaser.Group.prototype);
	ArrowGroup.prototype.constructor = ArrowGroup;

	_.extend(ArrowGroup.prototype, {
		getArrow: function(x, y) {
			var arrow = this.getFirstDead();
			arrow.reset(x, y);
			return arrow;
		}
	});

	exports.ArrowGroup = ArrowGroup;
})(this);