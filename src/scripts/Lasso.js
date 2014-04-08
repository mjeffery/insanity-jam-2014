(function(exports) {
	function Lasso(game, units) {
		Phaser.Sprite.call(this, game, 0, 0, 'lasso');
		
		this.units = units;
		this.events.onLasso = new Phaser.Signal();

		game.physics.enable(this, Phaser.Physics.ARCADE);

		this.lassoing = false;
		this.bubble = true;
		this.changeBubble = false;
		this.alpha = 0.6;
		this.visible = false;

		this.startPos = new Phaser.Point();
	}

	Lasso.prototype = Object.create(Phaser.Sprite.prototype);
	Lasso.prototype.constructor = Lasso;

	Lasso.preload = function(load) {
		load.image('lasso', 'assets/img/lasso.png');
	}

	_.extend(Lasso.prototype, {

		// need to lag the bubble re-enable to the next frame so the "click" 
		// from the command gets processed first
		update: function() {
			if(this.changeBubble) {
				this.bubble = !this.bubble;
				this.changeBubble = false;
			}
			if(this.lassoing) {
				var mouse = this.game.input.activePointer,
					mx = mouse.worldX,
					my = mouse.worldY,
					sx = this.startPos.x,
					sy = this.startPos.y;

				if(mx < sx) {
					this.x = mx;
					this.width = sx - mx;
				}
				else {
					this.x = sx;
					this.width = mx - sx;
				}

				if(my < sy) {
					this.y = my;
					this.height = sy - my;
				}
				else {
					this.y = sy;
					this.height = my - sy;
				}
			}
		},

		onInputDown: function(sprite, pointer) {
			if(this.bubble) {
				this.visible = true;
				this.lassoing = true;
				this.startPos.setTo(pointer.worldX, pointer.worldY);
			}
		},

		onInputUp: function(sprite, pointer) {
			if(this.lassoing) {
				var selected = [];
				this.game.physics.arcade.overlap(this, this.units, function(lasso, unit) {
					selected.push(unit);
				}, null, this);

				this.events.onLasso.dispatch(selected);
				this.lassoing = false;
				this.visible = false;
			}
		},

		onStartCommand: function() {
			this.bubble = false;
		},

		onEndCommand: function() {
			this.changeBubble = true; // we'll change it on the next frame
		}
	});

	exports.Lasso = Lasso;
})(this);