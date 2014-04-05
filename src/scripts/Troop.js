(function(exports) {
	function Troop(game, x, y, key) {
		Unit.call(this, game, x, y, key);

		this.init();
		this.inputEnabled = true;

		this.createSelectBox(32, 32);
		this.createHealthBar();

		this.activity = 'none';
		this.dir = 'none';

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
						this.stand();
						this.activity = 'none';
					}
				break;
			}

			switch(this.state) {
				case 'standing':
					if(this.body.onFloor()) {
						this.body.velocity.x = 0; //TODO control velocities?
						if(this.activity == 'seeking') {
							var dir = this.target > this.body.x ? 'right' : 'left';
							this.walk(dir);
						}
					}
					else 
						this.fall();
				break;

				case 'walking': 
					if(this.body.onFloor()) {
						if(this.activity === 'seeking') {
							if(this.dir == 'left') {
								if(this.target > this.body.x)
									this.walk('right');
								else if(this.body.blocked.left)
									this.jump();
							} 
							else if(this.dir == 'right') { 
								if(this.target < this.body.x)
									this.walk('left');
								else if(this.body.blocked.right) 
									this.jump();
							}
						}
						else if(this.activity === 'none') {
							this.stand();
						}
					}
					else 
						this.fall();
				break;

				case 'falling':
					if(this.body.onFloor()) 
						this.stand();
				break;

				case 'jumping':
					if(this.body.velocity.y > 0)
						this.fall();
					else {
						if(this.activity === 'seeking') {
							if(this.target < this.body.x) this.left();
							else if(this.target > this.body.y) this.right();
						}
					}

				break;
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
				this.target = null;
			}
		}
	});	

	exports.Troop = Troop;
})(this);