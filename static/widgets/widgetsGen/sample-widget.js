(function($) {
    $.fn.sample = function(options) {
	var opts = $.extend({}, $.fn.sample.defaults, options);
	return this.each(function() {
	    $this = $(this);
	    var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
	    $.fn.sample.createNote(o);
	});
    };
    $.fn.sample.defaults = {
	syncType	: 'sample',
	syncX		: 0,
	syncY		: 0,
	syncWidth	: 0,
	syncHeight	: 0,
	syncData1	: '',
	syncData2	: '',
	syncData3	: '',
	syncTitle	: '',
	syncId		: 0,
    };
    $.fn.sample.createNote = function(o) {
	if(!o.syncData1) {
	    if (o.syncId == 0) {
		// The widget is not stored in database
		$(document).widgetGen.save(o, function(id){o.syncId = id});
	    }
	    else {
		// The widget is already on DB so update it
		$(document).widgetGen.update(o);
	    }
	}
	else {
	    // Create the widget (CSS...)
	}


	.click(function(e){
	    $(document).widgetGen.remove(o);
	});

	/* CSS positioning
	    .css({'position':'absolute',
		  'top':o.syncY / 100 * window.innerHeight,
		  'left':o.syncX / 100 * window.innerWidth})
	*/

	//$('#desktop').append(_div_wrap);
    };
})(jQuery);