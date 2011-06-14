(function($) {
    $.fn.stickynote = function(options) {
	var opts = $.extend({}, $.fn.stickynote.defaults, options);
	return this.each(function() {
	    $this = $(this);
	    var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
	    $.fn.stickynote.createNote(o);
	});
    };
    $.fn.stickynote.defaults = {
	syncType	: 'stickynote',
	syncX	: 0,
	syncY	: 0,
	syncWidth	: 0,
	syncHeight	: 0,
	syncData1 : '',
	syncData2 : '',
	syncData3 : '',
	syncTitle : '',
	syncId	: 0,

	size 	: 'small',
	event	: 'click',
	color	: '#000000',
	drag	: false
    };
    $.fn.stickynote.createNote = function(o) {
	var _note_content = $(document.createElement('textarea'));
	var _div_note = $(document.createElement('div'))
	    .addClass('jStickyNote')
	    .css('cursor','move');
	if(!o.syncData1){
	    _div_note.append(_note_content);
	    var _div_create = $(document.createElement('div'))
		.attr('title','Create Sticky Note');
	    
	    _div_note.find('textarea').change(function(e){
		o.syncData1 = $(this).parent().find('textarea').val();

		if (o.syncId == 0){
		    
		    $(document).widgetGen.save(o, function(id){o.syncId = id});
		    
		    _div_note.find('textarea')
			.attr('style', 
			      'width:'+0.13 * window.innerHeight +'px;' + 'height:'+0.13 * window.innerHeight +'px;').die();
		}
		else{
		    $(document).widgetGen.update(o);
		}
		});
	    }
	else{
	    /*
	     *
	     * Si deja cree
	     *
	     */
	    _div_note.append('<p style="color:'+o.color+'">'+o.syncData1+'</p>');
	    _div_note.find('p').attr('style', 'width:'+0.13 * window.innerHeight +'px;' + 
				     'height:'+0.13 * window.innerHeight +'px;' + 'line-height : 120%;');
	}
	var _div_delete = 	$(document.createElement('div')).addClass('jSticky-delete');
	_div_delete.click(function(e){
	    $(document).widgetGen.remove(o);
	    $(this).parent().fadeOut('fast').remove();
	});
	var _div_wrap 	= 	$(document.createElement('div'))
	    .css({'position':'absolute',
		  'top':o.syncY / 100 * window.innerHeight,
		  'left':o.syncX / 100 * window.innerWidth})
	    .append(_div_note)
	    .append(_div_delete)
	    .append(_div_create);	
	_div_wrap.addClass('jSticky-medium');
	_div_wrap.prepend('<img id="img-sticky" style="position : absolute;z-index:0; "src="' + gl_pm.default_note_img +'"width="' + 0.18 * window.innerHeight + '"/>')
	if(o.containment){
	    _div_wrap.draggable({ containment: '#'+o.containment , scroll: false ,start: function(event, ui) {
		if(o.ontop)
		    $(this).parent().append($(this));
	    }});	
	}	
	else{
	    _div_wrap.draggable({ scroll: false,
				  start: function(event, ui) {
				      if(o.ontop)
					  $(this).parent().append($(this));
				  },
				  stop : function(event){

				      o.syncX = Math.round($(this).position().left / window.innerWidth * 100);
				      o.syncY = Math.round($(this).position().top / window.innerHeight * 100);
				      $(this).css({'left':o.syncX / 100 * window.innerWidth,
						   'top':o.syncY / 100 * window.innerHeight});
				      $(document).widgetGen.update(o);
				  }});	
	}
	_div_note.find('textarea').attr('style', 'width:'+0.13 * window.innerHeight +'px;' + 
					'height:'+0.13 * window.innerHeight +'px;');

	//_div_note.find('textarea').remove();
	$('#desktop').append(_div_wrap);
	//$('.jSticky-medium').width(0.15 * window.innerWidth).height(500);
    };
})(jQuery);