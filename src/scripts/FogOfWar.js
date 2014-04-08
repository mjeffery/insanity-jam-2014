(function(exports) {
	function FogOfWar(game, terrain) {
		this.game = game;
		this.terrain = terrain;
		this.units = [];

		var w = terrain.width,
			h = terrain.height,
			fogMap = this.fogMap = game.add.tilemap();

		fogMap.addTilesetImage('fog-of-war-tiles');

		var fogLayer = this.fogLayer = fogMap.create('fog', w, h, 32, 32);
		//fogMap.fill(12, 0, 0, w, h, 'fog');
		for(var x = 0; x < w; x++) {
			for(var y = 0; y < h; y++) {
				fogMap.putTile(FogOfWar.DARK_TILE, x, y);
			}
		}
	}

	FogOfWar.preload = function(load) {
		load.image('fog-of-war-tiles', 'assets/img/fog of war tiles.png');
	}

	FogOfWar.DARK_TILE = 11;
	FogOfWar.TRANSPARENT_TILE = 12;
	FogOfWar.DEFAULT_SIGHT_RANGE = 200;

	FogOfWar.prototype = {
		track: function(unit) {
			if(_.findIndex(this.units, { unit: unit }) < 0) {
				var layer = this.fogLayer,
					entry = {
						x: layer.getTileX(unit.x),
						y: layer.getTileY(unit.y),
						r: unit.sightRange || FogOfWar.DEFAULT_SIGHT_RANGE,
						unit: unit
					};

					unit.events.onKilled.addOnce(this.onKilled, this);
					this.setVisible(entry.x, entry.y, entry.r, true);

				this.units.push(entry);
			}
		},

		update: function() {
			var layer = this.fogLayer, x, y, r;
			_.forEach(this.units, function(entry) {
				x = layer.getTileX(entry.unit.x);
				y = layer.getTileY(entry.unit.y);
				r = entry.unit.sightRange || FogOfWar.DEFAULT_SIGHT_RANGE;

				if(x !== entry.x || y !== entry.y || r !== entry.r) {
					this.setVisible(entry.x, entry.y, entry.r, false);
					this.setVisible(x, y, r, true);
					entry.x = x;
					entry.y = y;
					entry.r = r;
				}
			}, this);
		},

		setVisible: function(x, y, r, show) {
			var map = this.fogMap,
				layer = this.fogLayer;

			var tile_r = layer.getTileX( 32 * x + r) - x,
				left = x - tile_r,
				top = y - tile_r,
				right = x + tile_r,
				bottom = y + tile_r,
				i, j, dx, dy, d, tile, real_tile;
			
			for(i = left; i <= right; i++) {
				for(j = top; j <= bottom; j++) {
					if(i >= 0 && i < map.width &&
					   j >= 0 && j < map.height)
					{
						dx = i - x;
						dy = j - y;
						d = Math.sqrt(dx*dx + dy*dy);

						if(d <= tile_r) {
							if(show)
								this.addLight(i, j);
							else 
								this.removeLight(i, j);
						}
					}
				}
			}
		},

		addLight: function(x, y) {
			var map = this.fogMap,
				layer = this.fogLayer,
				tile = map.getTile(x, y);

			if(tile.lights === undefined || tile.lights <= 0) {
				tile.index = FogOfWar.TRANSPARENT_TILE;
				tile.lights = 1;
				layer.dirty = true;
			}
			else 
				tile.lights++;
		},

		removeLight: function(x, y) {
			var map = this.fogMap,
				layer = this.fogLayer,
				tile = map.getTile(x, y);

			if(tile.lights) {
				tile.lights--;
				if(tile.lights <= 0) {
					var real_tile = this.terrain.getTile(x, y);
					tile.index = !!real_tile ? real_tile.index - 1 : 0;
					layer.dirty = true;
				}
			}
		},

		// removed the unit
		// hide its sight range
		onKilled: function(sprite) {
			var units = this.units,
				index = _.findIndex(units, { unit: sprite }),
				entry = units[index];

			this.setVisible(entry.x, entry.y, entry.r, false);
			this.units.splice(index, 1);
		}
	};

	exports.FogOfWar = FogOfWar;
})(this);