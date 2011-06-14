/*
 * Create new icon
 */

var classMerge = function(obj1, obj2){
    for (var p in obj2) {
	try {
	    // Property in destination object set; update its value.
	    if (obj2[p].constructor==Object) {
		obj1[p] = MergeRecursive(obj1[p], obj2[p]);
	    } else {
		obj1[p] = obj2[p];
	    }
	} catch(e) {
	    // Property in destination object not set; create it and set its value.
	    obj1[p] = obj2[p];
	}
    }
    return obj1;
}

/*
 *
 * Class Icon
 *
 */
var Icon = (function () {
    // constructor
    var cls = function (o) {
	// Default options
	this.options = classMerge({
	    IconX : 20,
	    IconY : 90,
	    Url : '',
	    IconId : 0,
	    IconTitle : 'default',
	    Movable : true,
	    ExternalIcon : true,
	    IconImg : gl_pm.default_icon_img
	}, o);
	
	var randed = S4()+'-'+S4();
	var x_icon = 0.014 * window.innerWidth;
	var width_icon = 0.050 * window.innerWidth;
	var x = (this.options.IconX / 100) * window.innerWidth;
	var y = (this.options.IconY / 100) * window.innerHeight;

	var icon = '<a class="abs icon" style="left:' + x + 'px;';
	icon += 'top:'+ y + 'px; width :'+ width_icon  +'px" target="_blank"';
	icon += 'href="' + this.options.Url + '"';
	if (this.options.Movable == false)
	    icon += 'stat="static"';
	icon += 'id="' + this.options.IconId + '">';

	if (this.options.ExternalIcon == true)
	    icon +='<img src="' + this.options.IconImg;
	else
	    icon +='<img src="' + gl_pm.default_icon_img;
	icon += '" alt="icon" width="'+ x_icon + '" height="' + x_icon + '"/>';
	icon += this.options.IconTitle;
	icon += '</a>';
	
	$('#desktop').append(icon);
    };
    return cls;
})();

/*
 *
 * Singleton Icon
 *
 */

var iconHandling = function(){
    var newIcon = function(x, y, url_get){

	modalize();
	
	$(document).unbind('contextmenu');

	// Construit la window 
	var box = "<div class='add-icon-box'>";
	box += "<div id='exit-add'> X </div>";
	box += "<center><b>New icon</b></center><br/>";
	box += "<input type='text' id='add1-icon-title'/><br/><br/>";

	if (typeof(url_get) == 'undefined')
	    box += '<b>Url</b> : <br/><input type="text" id="add1-url-name" value="http://" /><br/>';
	else
	    box += '<b>Url</b> : <br/><input type="text" id="add1-url-name" value="' + url_get + '" /><br/>';
	box += "<br/><center><button type='button' id='add1-url-button'>Create</button></center><br/>";
	box += "</div>";

	$(box).appendTo("body");
	
	{// Window buttons handling
	    // Cache
	    var el = $('.add-icon-box');
	    // Placeholder
	    set_auto_text(el.find('#add1-icon-title'), 'Icon title');		
	    
	    el.find('#exit-add').click(function(){
		Skytoop.init.right_click();
		$('.add-icon-box').fadeOut(150).remove();
		$('#mask').die().fadeOut(250);
	    });
	    
	    $('#mask').click(function () {  
		Skytoop.init.right_click();
		$('.add-icon-box').fadeOut(150).remove();
		$(this).fadeOut(250);
	    });
	}

	{// Executing the creation (pressing enter or Create button
	    var execute_creation = function(){
		var url = el.find('#add1-url-name').val();
		var title = el.find('#add1-icon-title').val();
		var x_perc = Math.round(x / window.innerWidth * 100);
		var y_perc = Math.round(y / window.innerHeight * 100);
		var randed = S4();


		var v = new RegExp(); 
		v.compile("^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$"); 
		if (v.test(url) == false){
		    notify('! Wrong URL format !');
		    return false;
		}

		if (title.length == 0)
		{
		    notify('! Icon title is empty !');
		    return false;
		}
		    

		el.fadeOut(150).remove();
		$('#mask').fadeOut(250).die();
		
		new Icon({
		    IconX: x_perc,
		    IconY : y_perc,
		    Url : url,
		    IconId : randed,
		    IconTitle : title
		});

		$.ajax({
		    type: "GET",
		    url : ajax_urls.icon.new_icon,	    
		    dataType : "json",
		    data : {"x" : x_perc,
			    "y" : y_perc,
			    "title" : title,
			    "url" : url},
		    beforeSend : function(){
			indicator.add_process();
			$('#' + randed).children().attr('src', gl_pm.waiting_img);
		    },
		    success : function(data){
			
			iconized.tmp_icons += 1;
			// If more than 3 icons was created activate public desktop
			if (iconized.tmp_icons >= 3 && iconized.begin_icons < 3
			    && publicView == true && modif == true) {
			    notify('Success : This page now become public, you appear on search result!', 4500);
			    $.ajax({
				type : "GET",
				url : ajax_urls.switchpublic
			    });
			}
			    

			Skytoop.init.right_click();
			indicator.rm_process();

			var icon_render = $('#' + randed);
			if (data.url != '')
			    icon_render.children().attr('src', data.url);
			else
			    icon_render.children().attr('src', gl_pm.default_icon_img);
			icon_render.attr('id', data.id);
			
			// Remove les arguments get en refreshant la page 
			if (typeof(url_get) != 'undefined'){
			    var baseUrl = window.location.href;
			    baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('?url='));

			    window.location = baseUrl;

			    /*var baseURL = .split( '/' );
			      alert(baseURL[2]);*/
			    //
			}
		    }
		});
	    };
	    
	    // Execution of the previous function 
	    el.find('#add1-url-button').click(execute_creation);
	    
	    el.bind('keypress', function(e){
		if (e.keyCode == 13)
		    execute_creation();
	    });
	} // End of executional part

    }
    var j = 0;
    var handleDesktopIcons = function(){
	// Make top menus active.
	$('a.menu_trigger').live('mousedown', function() {
	    if ($(this).next('ul.menu').is(':hidden')) {
		Skytoop.util.stop_act();
		$(this).addClass('active').next('ul.menu').show();
	    }
	    else
		Skytoop.util.stop_act();
	}).live('mouseenter', function() {
	    if ($('ul.menu').is(':visible')) {
		Skytoop.util.stop_act();
		$(this).addClass('active').next('ul.menu').show();
	    }
	});
	
	$('a.icon').live('mousedown', function(event) {
	    Skytoop.util.stop_act();
	}).live('mouseenter', function(){
	    act_icon = $(this); 
	}).live('click', function() {
	    
	    var x = $(this).attr('href');
	    var y = $(x).find('a').attr('href');
	    
	    // Show the taskbar button.
	    if ($(x).is(':hidden')) {
		$(x).remove().appendTo('#dock');
		$(x).show('fast');
	    }

	    //$(y).find('div.window_content').hide();
	    Skytoop.util.window_flat();
	    $(y).addClass('window_stack').fadeIn(250, function(){
		if ($(this).find('div.window_content').children().size() == 0){
		    var url = $(this).find('div.window_content').attr('alt');
		    $(this).find('div.window_content')
			.append('<iframe class="testframe" src="' + 
				url + '" frameborder="no" width="100%" height="99.5%"></iframe>');
		}
		$(y).find('div.window_content').fadeIn();
	    });
	    
	}).live('mouseenter', function() {
	    if ($(this).attr('stat') == 'static')
		return false;
	    $(this).die('mouseenter').draggable({
		
		containment: 'parent',
		start : function(event) {
		    $('#desktop a.icon').each(function(i, element){
			if ($(element).attr('id') != act_icon.attr('id'))
			$(this).css({'opacity':'0.3'});
		    });
		    
		    $(this).css({'top':event.pageY - $(this).height(),
				 'left':event.pageX - $(this).width() / 2});
		},
		drag : function(e) {
		    if (e.pageX % 5 == 2){		
			$('#desktop a.icon').each(function(i, element){
			    if ($(element).attr('id') != act_icon.attr('id'))
			    $(this).removeClass('ui-draggable-dragging')
				.css({'opacity':'0.3'});
			    if ($(element).offset().left > e.pageX - 150 &&
				$(element).offset().left < e.pageX + 70 &&
				$(element).offset().top > e.pageY -150 &&
				$(element).offset().top < e.pageY + 70){
				// If icon in region open it
				if ($(element).attr('id') != act_icon.attr('id'))
				    $(element).addClass('ui-draggable-dragging').css({'opacity':'1'});
			    }
			});
		    }
		},
		stop : function(event, el) {
		    $('#desktop a.icon').each(function(i, element){
			$(this).removeClass('ui-draggable-dragging').css({'opacity':'1'});
		    });

		    // Post data when icon position modified
		    var x_perc = Math.round($(this).position().left / window.innerWidth * 100);
		    var y_perc = Math.round($(this).position().top / window.innerHeight * 100);
		    
		    
		    // p = x_perc % 10;
		    // if (p <= 3)
		    // 	x_perc -= p;
		    // else if (p > 3 && p <= 6)
		    // 	x_perc = (x_perc - p) + 5;
		    // else
		    // 	x_perc = (x_perc - p + 10);

		    // Icon positioning facilitation removed on Y axe
		    // p = y_perc % 10;
		    // if (p <= 5)
		    // 	y_perc -= p ;
		    // else
		    // 	y_perc = (y_perc - p + 10);

		    indicator.add_process();
		    $.ajax({
			type : "GET",
			url : ajax_urls.icon.modify_icon,
			data : {"x" : x_perc,
				"y" : y_perc,
				"id" : act_icon.attr("id")},
			success :function(data){
			    indicator.rm_process();
			}
		    });
		    $(this).css({'left':x_perc / 100 * window.innerWidth,
				 'top':y_perc / 100 * window.innerHeight});
		}
	    });
	});
	// Taskbar buttons.
	$('#dock a').live('click', function() {
	    Skytoop.util.window_flat();
	    $($(this).attr('href')).show().addClass('window_stack');
	});
    }
    /*
     * Public methods
     */
    return {
	newIcon : newIcon,
	handleDesktopIcons : handleDesktopIcons
    }
}();