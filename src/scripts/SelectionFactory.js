(function(exports) {
	function SelectionFactory(game) {
		Phaser.Group.call(this, game);
	}

	SelectionFactory.prototype = Object.create(Phaser.Group.prototype);
	SelectionFactory.prototype.constructor = SelectionFactory;

	SelectionFactory.preload = function(load) {
		load.image('1x1-select-box', 'assets/img/1x1 selected.png');
	};

	_.extend(SelectionFactory.prototype, {
		findByKey: function(key, exists) {
			if(exists === undefined) exist = false;

			this.cursor = this.getTop();
			do {
				var sprite = this.cursor;
				if(sprite.exists == exists && sprite.key === key) {
					return sprite;
				}
				this.next();
			}
			while(this.cursor !== this.getTop());
		
			return null;
		}
	});

	exports.SelectionFactory = SelectionFactory;

})(this);