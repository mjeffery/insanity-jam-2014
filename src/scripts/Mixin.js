(function(exports) {
	function create(mixin) {
		return function(prototype) {
			for(var key in mixin) {
				if(!mixin.hasOwnProperty(key)) continue;
				var prop = mixin[key];
				if(prototype[key] && typeof(prop) === 'function')
					Util.override(prototype, key, prop);
				else
					prototype[key] = prop;
			}
		}
	}

	exports.Mixin = {
		create: create
	}
})(this);