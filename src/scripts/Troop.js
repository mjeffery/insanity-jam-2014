(function(exports) {
	function Troop(game, x, y, key, bloodspray) {
		Unit.call(this, game, x, y, key);

		this.init();
		this.inputEnabled = true;

		this.createSelectBox(32, 32);
		this.createHealthBar();

		this.activity = 'none';
		this.dir = Phaser.NONE;
		this.blood = bloodspray;

		this.fall();
	}	

	Troop.SEEK_TOLERANCE = 4;

	Troop.prototype = Object.create(Unit.prototype);
	Troop.prototype.constructor = Troop;

	Mixin.humanoid(Troop.prototype);

	_.extend(Troop.prototype, {
		think: function() {
			switch(this.activity) {
				case 'seeking':
					if(Math.abs(this.target - this.body.x) < Troop.SEEK_TOLERANCE) {
						//TODO fire a nudge bullet for spacing?
						this.dir = Phaser.NONE;
						this.stand();
						this.activity = 'none';
					}
				break;
			}

			this.updateState();
		},

		destination: function() {
			if(this.activity === 'seeking')
				return this.target;
		},

		damage: function(amount) {
			this.currHp -= amount;
			this.healthBar.setHp(this.currHp, this.maxHp);

			var x = this.x,
				y = this.y;

			//TODO play some damage sounds on a slight delay
			if(this.currHp <= 0) {
				this.blood.gush(x, y);
				this.destroy();
			}
			else {
				this.blood.spray(x, y);
			}
		},

		seek: function(target) {
			this.target = target;
			this.activity = 'seeking';
		},

		onMessage: function(msg) {
			if(msg.target) this.seek(msg.target);
			if(msg.command === 'stop') {
				this.activity = 'none';
				this.dir = Phaser.NONE;
				this.target = null;
			}
		}
	});	

	exports.Troop = Troop;
})(this);