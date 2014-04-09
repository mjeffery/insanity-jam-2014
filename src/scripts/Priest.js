(function(exports) {
	function Priest(game, x, y, bloodspray) {
		Troop.call(this, game, x, y, 'priest', bloodspray);
		this.commands = Priest.COMMANDS;
		this.setHp(90, 90);
		this.walkSpeed = 90;

		this.castTarget = new Phaser.Point();
		this.castTarget.setTo(-1, -1);
	}

	Priest.prototype = Object.create(Troop.prototype);
	Priest.prototype.constructor = Priest;

	Priest.COMMANDS = ['gravityUp', 'gravityDown', 'move', 'stop']; //TODO add spellcast 

	Priest.MIN_CAST_DISTANCE = 200;

	Priest.preload = function(load) {
		load.spritesheet('priest', 'assets/spritesheet/priest.png', 32, 32);
	}

	Mixin.create({
		think: function() {
			switch(this.activity) {
				case 'casting': 
					if(this.castTarget.distance(this) <= Priest.MIN_CAST_DISTANCE) {
						var x = this.castTarget.x,
							y = this.castTarget.y;
						this.cast(x, y);
					}
				break;
			}

			this.__super();
		},

		destination: function() {
			if(this.activity === 'casting')
				return this.castTarget.x;
			else
				return this.__super();
		},

		cast: function(x, y) {
			var field = new GravityField(this.game, x, y, this.spellDir);
			field.effect = this.gravityEffect;
			field.spawn();
			
			this.spellsGroup.add(field);

			this.changeActivity('none');
			this.stand();
			//TODO expend the resource
		},

		send: function(msg) {
			if(msg.command === 'change-gravity') {
				this.spellDir = msg.dir;
				this.castTarget.copyFrom(msg.target);
				this.changeActivity('casting');
			}
			else
				return this.__super(msg);
		}
	})
	(Priest.prototype);

	exports.Priest = Priest;
})(this);