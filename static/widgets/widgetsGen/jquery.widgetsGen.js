/*
 *
 * Main entry to widget creation and db access
 * by Strzelewicz Alexandre on 19/03/2011
*
 */

/*
 * Step to add a new widget :
 * 1# add widget name on select Type ($.fn.widgetGem.select) + file to load
 * 
 */
function loadDynJs(url){
    $('#plugin-dyn-add').append("<script src='" + url + "'></script>");
}

(function($) {
    /*
     * Init 
     */
    $.fn.widgetGen = function(options) {
	var opts = $.extend({}, $.fn.widgetGen.defaults, options);
	return this.each(function(){
	    var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
	    $.fn.widgetGen.select(o);
	});
    };
    $.fn.widgetGen.defaults = {
	syncType	: '',
	syncX		: 0,
	syncY		: 0,
	syncWidth	: 0,
	syncHeight	: 0,
	syncData1	: '',	 
	syncData2	: '',
	syncData3	: '',
	syncTitle	: '',
	syncId		: 0
    };
    /*
     * Select widget by type
     * + load JS
     * + Create it with direct parameters passing
     */
    $.fn.widgetGen.select = function(o) {
	switch (o.syncType)
	{
	case 'stickynote':
	    //loadDynJs('../static/widgets/notes/jquery.stickynote.js');
	    $('#desktop').stickynote(o);
	    break;
	case 'zone':
	    //loadDynJs('../static/widgets/drawZone/jquery.drawZone.js');
	    $('#desktop').drawZone(o);
	    break;
	case 'winamp-app':
	    $('#desktop').winamp(o);
	    break;
	default :
	    alert('Wrong widgetsGen name');
	}
    };
    /*
     * New widget (in DB)
     * o : same fields as this settings
     * success : function pointer to execute when success (takes an ID)
     * failure : same but if failure
     */
    $.fn.widgetGen.save = function(o, success, failure){
	$.fn.widgetGen.send('/Skytoop/widget/new_widget',
			    o,
			    success,
			    failure);
    };
    /*
     * Widget Update
     */
    $.fn.widgetGen.update = function(o, success, failure){
	$.fn.widgetGen.send('/Skytoop/widget/update_widget',
			    o,
			    success,
			    failure);
    };
    /*
     * Delete
     */
    $.fn.widgetGen.remove = function(o, success, failure){
	$.fn.widgetGen.send('/Skytoop/widget/remove_widget',
			    o,
			    success,
			    failure);
    };
    /*
     * Db query
     */
    $.fn.widgetGen.send = function(url, o, success, failure){
	indicator.add_process();
	$.ajax({
	    type : "POST",
	    url : url,
	    data : $.fn.widgetGen.formatData(o),
	    success : function(data){
		indicator.rm_process();
		if (typeof(success) != 'undefined')
		    success(jQuery.parseJSON(data).id);
	    },
	    error : function(data){
		indicator.rm_process();
		if (typeof(failure) != 'undefined')
		    failure();
		else
		    notify('You can\'t modify it !')
	    }
	});
    }
    /*
     * Utils
     */
    $.fn.widgetGen.formatData = function(o){
	return data = {"type"	: o.syncType,
		       "x"	: o.syncX,
		       "y"	: o.syncY,
		       "width"	: o.syncWidth,
		       "height" : o.syncHeight,
		       "data1"	: o.syncData1,
		       "data2"	: o.syncData2,
		       "data3"	: o.syncData3,
		       "title"	: o.syncTitle,
		       "id"	: o.syncId};
    };
})(jQuery);
/*
 *
 * End
 *
 */