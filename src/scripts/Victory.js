(function(exports) {
	function Victory() {
		FadingState.call(this);
	}

	Victory.prototype = Object.create(FadingState.prototype);
	Victory.prototype.constructor = Victory;

	_.extend(Victory.prototype, {
		create: function() {
			this.stage.backgroundColor = '#000000';
		}
	});

	exports.Victory = Victory;
})(this);