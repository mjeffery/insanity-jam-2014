(function(exports) {
	function GameRules(game) {
		this.state = {
			count: {	// counts of living, breathing enemies
				peasants: 0,
				humans: 0,
				orcs: 0
			},
			pending: {	// counts of enemies that might 
				peasants: 0,
				humans: 0,
				orcs: 0
			},
			score: {
				kills: 0,
				deaths: 0,
				rescued: {
					soldiers: 0,
					archers: 0,
					peasants: 0,
					priests: 0
				},
			}
		};

		this.dirty = false;

		this.events = {
			onStateChange: new Phaser.Signal(),
			onVictory: new Phaser.Signal(),
			onDefeat: new Phaser.Signal()
		}
	}

	GameRules.prototype = {
		update: function() {
			if(this.dirty) {
				this.events.onStateChange.dispatch(this.state);
				this.dirty = false;

				if(this.state.count.humans <= 0) {
					this.events.onDefeat.dispatch();
				}
				else if(this.state.count.orcs <= 0) { // TODO factor random spawns in?
					this.events.onVictory.dispatch(this.state.count.peasants);
				}
			}
		},

		onSpawn: function(unit) {
			if(unit instanceof Peasant) {
				this.state.count.peasants++;
				unit.events.onKilled.addOnce(this.onPeasantKilled, this);
			}

			if(unit.team === 'orc') {
				this.state.count.orcs++;
				unit.events.onKilled.addOnce(this.onOrcKilled, this);
			}
			else if(unit.team === 'human') {
				this.state.count.humans++;
				unit.events.onKilled.addOnce(this.onHumanKilled, this);
			}

			this.dirty = true;
		},

		onPeasantKilled: function(sprite) {
			this.state.count.peasants--;
			this.dirty = true;
		},

		onHumanKilled: function(human) {
			this.state.count.humans--;
			this.state.score.deaths++;
			this.dirty = true;
		},

		onOrcKilled: function(orc) {
			this.state.count.orcs--;
			this.state.score.kills++;
			this.dirty = true;
		}
	};

	exports.GameRules = GameRules;
})(this);