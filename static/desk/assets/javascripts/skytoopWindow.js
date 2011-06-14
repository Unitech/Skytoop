/*
 * Copyright 2011, Alexandre Strzelewicz
 * Licensed under the MIT Version
 * Singleton windowHandling
 */

var windowHandling = function(){

    var desktop = $('#desktop');

    /*
     * Build special window for file manager and other internal
     * applications
     */
    var buildWindow = function(options){
	
	var settings = $.extend({
	    WindowTitle : 'Default',
	    WindowTitleBottom : '',
	    IconX : 20,
	    IconY : 90,
	    Movable : true,
	    TemplateUrl : null,
	    IsDirect : false,
	    DesktopId : 0,
	    ExternalIco : false,
	    UrlExternalIco : '',
	    IconId : 'default',
	    IconImg : gl_pm.default_icon_img
	}, options || {});

	var buildWindow = function(){
		// ICON
		var randed = S4()+'-'+S4();
		var x_icon = 0.014 * window.innerWidth;
		var width_icon = 0.050 * window.innerWidth;
		var x = (settings.IconX / 100) * window.innerWidth;
		var y = (settings.IconY / 100) * window.innerHeight;

		if (settings.IsDirect == false){
		    var icon = '<a class="abs icon" style="left:' + x + 'px;';
		    icon += 'top:'+y+'px;width:'+width_icon+'px;" id="' + settings.IconId + '"';
		    if (settings.Movable == false)
			icon += 'stat="static"';
		    icon += 'href="#icon_' + randed + '">';
		}
		else{
		    var icon = '<a class="abs icon" style="left:' + x + 'px;';
		    icon += 'top:'+ y + 'px; width :'+ width_icon  +'px" target="_blank"';
		    icon += 'href="' + settings.TemplateUrl + '"';
		    if (settings.Movable == false)
			icon += 'stat="static"';
		    icon += 'id="' + settings.IconId + '">';
		}
		
		if (settings.ExternalIco == false)
		    icon +='<img src="' + settings.IconImg;
		else
		    icon +='<img src="' + settings.UrlExternalIco;

		icon += '" alt="icon" width="'+ x_icon + '" height="' + x_icon + '"/>';
		icon += settings.WindowTitle;
		icon += '</a>';
	    
	   
		desktop.append(icon);
					
		//WINDOW
		if (settings.IsDirect == false){
		    var win = '<div id="window_' + randed + '" class="abs window">';
		    win += '<div class="abs window_inner">';
		    win += '<div class="window_top">';
		    win += '<span class="float_left">';
		    win += settings.WindowTitle;
		    win += '</span>';
		    win += '<span class="float_right">';
		    win += '<a href="#" class="window_min"></a>';
		    win += '<a href="#" class="window_resize"></a>';
		    win += '<a href="#icon_' + randed + '" class="window_close"></a>';
		    win += '</span>';
		    win += '</div>';
		    win += '<div class="abs window_content" alt="' + settings.TemplateUrl + '">';
		    win += '</div>';
		    win += '<div class="abs window_bottom">';
		    win += settings.WindowTitleBottom;
		    win += '</div>';
		    win += '</div>';
		    win += '<span class="abs ui-resizable-handle ui-resizable-se"></span>';
		    win += '</div>';
		    $('#wrapper').append(win);
		    // TASKBAR
		    var taskbar = '<li id="icon_' + randed + '">';
		    taskbar += '<a href="#window_' + randed + '">';
		    taskbar += settings.WindowTitle;
		    taskbar += '</a>';
		    taskbar += '</li>';
		    $('#dock').append(taskbar);
		}
	    }
	buildWindow();
    }

    var windowManager = function(){
	var active_window = $('div.window')

	active_window.live('mousedown', function() {
	    Skytoop.util.window_flat();
	    $(this).addClass('window_stack');
	}).live('mouseenter', function() {
	    $(this).die('mouseenter').draggable({
		iframeFix : true,
		cancel: 'a',
		containment: 'parent',
		handle: 'div.window_top'
	    }).resizable({
		//alsoResize : 'div.window_content',
		iframeFix : true,
		//ghost : true,
		containment: 'parent',
		minHeight : 150,
		minWidth : 300,
		start : function(){
		    active_window.css({'opacity': 0.3});
		    $('div.window_content').hide();
		},
		stop : function(){
		    active_window.css({'opacity': 1});
		    $('div.window_content').show();
		}
	    });
	}).find('div.window_top').live('dblclick', function() {
	    Skytoop.util.window_resize(this);
	}).find('img').live('dblclick', function() {
	    $($(this).closest('div.window_top').find('a.window_close').attr('href')).hide('slow');
	    $(this).closest('div.window').hide();
	    return false;
	});

	// Minimize the window.
	$('a.window_min').live('click', function() {
	    $(this).closest('div.window').fadeOut('fast');
	});

	// Maximize or restore the window.
	$('a.window_resize').live('click', function() {
	    Skytoop.util.window_resize(this);
	});

	// Close the window.
	$('a.window_close').live('click', function() {
	    $(this).closest('div.window').fadeOut('fast');
	    $($(this).attr('href')).hide('slow');
	});

	// Show desktop button, ala Windows OS.
	$('#show_desktop').live('click', function() {
	    // If any windows are visible, hide all.
	    if ($('div.window:visible').length) {
		$('div.window').hide();
	    }
	    else {
		// Otherwise, reveal hidden windows that are open.
		$('#dock li:visible a').each(function() {
		    $($(this).attr('href')).show();
		});
	    }
	});

	$('table.data').each(function() {
	    // Add zebra striping, ala Mac OS X.
	    $(this).find('tbody tr:odd').addClass('zebra');
	}).find('tr').live('mousedown', function() {
	    // Highlight row, ala Mac OS X.
	    $(this).closest('tr').addClass('active');
	});
    }
    
    /*
     * Window flat
     */
    var windowFlat = function(){
	$('div.window').removeClass('window_stack');
    }
    /*
     * Window resize + maximization
     *
     */
    var windowResize = function(el){
	var win = $(el).closest('div.window');
	
	if (win.hasClass('window_fulled')){
	    win.animate({
		opacity : 'show',
		queue : true,     
		duration : this.WindowUnMax,
	    });
	    win.animate({
		top : win.attr('data-t'),
		left : win.attr('data-l'),
		width:    win.attr('data-w'),
		height :  win.attr('data-h'),
	    }).removeClass('window_fulled');
	}
	/* MAXIMIZE */
	else {
	    /* store data in attributes */
	    win.attr({
		'data-t': win.css('top'),
		'data-l': win.css('left'),
		'data-w': win.css('width'),
		'data-h': win.css('height')
	    });

	    /* animate maximizing window */
	    /*win.animate({
		opacity : 'show',
		queue : true, 
		duration : 500,
	    });*/

	    win.animate({
		top : $('#taskbar').height() + 10,
		left : 0,
		width: $(window).width(),
		height : $(window).height() - 30
	    }).addClass('window_fulled');
	}
	
	// Bring window to front.
	Skytoop.util.window_flat();
	win.addClass('window_stack');
    }

    /*
     * Public methods
     */
    return {
	windowResize : windowResize,
	windowFlat : windowFlat,
	windowManager : windowManager,
	buildWindow : buildWindow
    }
}();