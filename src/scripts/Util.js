(function(exports) {
	exports.Util = {
		override: function(proto, name, fn) {
			var superFn = proto[name];
			proto[name] = function() {
				var prev = this.__super;
				this.__super = superFn;
				fn.apply(this, arguments);
				this.__super = prev;
			}
		}
	};
})(this);