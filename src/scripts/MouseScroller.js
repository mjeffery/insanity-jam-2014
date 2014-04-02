(function(exports) {
	function MouseScroller(elem) {
		this.elem = elem;
		var self = this;

		function mousemove(e) {
			var $this = $(this),
				offset = $this.offset(),
				x = e.pageX - offset.x,
				y = e.pageY - offset.y;

			if(!self.mouseover) {
				var w = $this.width(),
					h = $this.height();

				if(x < 0) {

				}
			}
		}
		
		$(elem)
			.mouseout(function(e) { 
				self.mouseout = true;
				$(elem).on('mousemove', mousemove);
			})
			.mouseover(function(e) {
				self.mouseout = false;
				$(elem).off('mousemove', mousemove);
			});
	}

	exports.MouseScroller = MouseScroller;
})(this);