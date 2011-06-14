/*
 *
 * Widget template
 * Methode to use for sync :
 *
 * $(document).widgetGen.save(o, function(id){o.syncId = id});
 * $(document).widgetGen.update(o);
 * $(document).widgetGen.remove(o);
 *
 */


(function($) {
    $.fn.winamp = function(options) {
	var opts = $.extend({}, $.fn.winamp.defaults, options);
	return this.each(function() {
	    $this = $(this);
	    var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
	    $.fn.winamp.createNote(o);
	});
    };
    $.fn.winamp.defaults = {
	syncType	: 'stickynote',
	syncC	: 0,
	syncY	: 0,
	syncWidth	: 0,
	syncHeight	: 0,
	syncData1 : '',
	syncData2 : '',
	syncData3 : '',
	syncTitle : '',
	syncId	: 0
    };
    $.fn.winamp.createNote = function(o) {
	if (o.syncId == 0)
	    
	$(document).widgetGen.save(o, function(id){o.syncId = id});
	$(document).widgetGen.update(o);
	$(document).widgetGen.remove(o);
    };
})(jQuery);
