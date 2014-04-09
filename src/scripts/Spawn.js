(function(exports) {
	function Spawn(game, humans, orcs, arrows, spells, gravityEffect, huts) {
		this.game = game;
		this.humans = humans;
		this.orcs = orcs;
		this.huts = huts;

		this.manblood = new BloodSpray(game, 'man-blood');
		this.orcblood = new BloodSpray(game, 'orc-blood');

		this.arrows = arrows;
		this.spells = spells;
		this.gravityEffect = gravityEffect;

		this.events = {
			onSpawn: new Phaser.Signal()
		}
	}

	function tileYToWorld(y) {
		return y * 32 + 16;
	}

	function tileXToWorld(x) {
		return x * 32 + 16;
	}

	Spawn.prototype = {
		soldier: function(tx, ty, useWorld) {
			var x = useWorld ? tx : tileXToWorld(tx),
				y = useWorld ? ty : tileYToWorld(ty),
				unit = new Soldier(this.game, x, y, this.manblood);

			unit.foes = this.orcs;
			this.humans.add(unit);

			this.events.onSpawn.dispatch(unit);

			return unit;
		},

		archer: function(tx, ty, useWorld) {
			var x = useWorld ? tx : tileXToWorld(tx),
				y = useWorld ? ty : tileYToWorld(ty),
				unit = new Archer(this.game, x, y, this.manblood);

			unit.foes = this.orcs;
			unit.arrows = this.arrows;
			this.humans.add(unit);

			this.events.onSpawn.dispatch(unit);

			return unit;
		},

		peasant: function(tx, ty, useWorld) {
			var x = useWorld ? tx : tileXToWorld(tx),
				y = useWorld ? ty : tileYToWorld(ty),
				unit = new Peasant(this.game, x, y, this.manblood);

			this.events.onSpawn.dispatch(unit);
			this.humans.add(unit);

			return unit;
		},

		priest: function(tx, ty, useWorld) {
			var x = useWorld ? tx : tileXToWorld(tx),
				y = useWorld ? ty : tileYToWorld(ty),
				unit = new Priest(this.game, x, y, this.manblood);
		
			unit.gravityEffect = this.gravityEffect;
			unit.spellsGroup = this.spells;
			this.humans.add(unit);

			this.events.onSpawn.dispatch(unit);

			return unit;
		},

		orc: function(tx, ty, useWorld) {
			var x = useWorld ? tx : tileXToWorld(tx),
				y = useWorld ? ty : tileYToWorld(ty),
				sex = this.game.rnd.pick(['male', 'female']),
			 	unit = new Orc(this.game, x, y, sex);

			unit.foes = this.humans;
			unit.blood = this.orcblood;
			this.orcs.add(unit);

			this.events.onSpawn.dispatch(unit);

			return unit;
		},

		hut: function(x, y, units) {
			var x = tileXToWorld(x),
				y = tileYToWorld(y),
				hut = new Hut(this.game, x, y+16, this.humans, this.fog, this, units);

			this.huts.add(hut);

			return hut;
		},

		orcParty: function(x, y) {
			var x = tileXToWorld(x),
				y = tileYToWorld(y);

			this.orc(x - 16, y, true);
			if(this.game.math.chanceRoll(10))
				this.orc(x, y, true);
			this.orc(x + 16, y, true);
		}
	};

	exports.Spawn = Spawn;

})(this);