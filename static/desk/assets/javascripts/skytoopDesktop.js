/*
 * Desktop handling
 */

var desktopHandling = function(){

    var desktop = $('#desktop');
    var apps = $('#apps-select');

    var min_pan = $('.min-control-panel');

    var menu = "<ul id='custom-menu'>";
    menu += "<li id='cnf'>Create new icon</li>";
    menu += "<li id='cnn'>New note<li>";
    menu += "<li id='cnl'>Delete icon</li>";
    menu += "</ul>";

    /******************************************************************
     * 
     *         For the remarks at the bottom right of the desktop
     *
     ******************************************************************/
    
    var feedback = function(){
	$('#remarks-button').click(function(){
	    $.ajax({
		type : "GET",
		data : {"remarks" : $('#remarks-comment').val()},
		url : "/Skytoop/note_log/add_remark",
		typeData : "json",
		success : function(data){
		    notify("Thanks !");
		    $('#remarks-comment').val("");
		}
	    });
	});
    }

    /*
     * On the right panel, represent add apps
     */
    
    var appStore = function(){
	
	apps.find('#install-button').click(function(){
	    desktop.widgetGen({
		syncType :  'winamp-app'
	    });
	});
    }

    /*
     * Name cant be more explicit
     */
    var wallpaper = function(){
	// Add wallpaper last, to prevent blocking.
	if (desktop.length) {
	    var walp = $('#wallpaper');

	    var bp = walp.attr('alt');
	    var back_col = walp.attr('alt2');
	    var position = walp.attr('alt3');

	    $('body').css({'background-image': "url('" + bp + "')",
			   'background-color': back_col,
			   'background-position': position});
	}
    }

    /*
     * Search bar 
     * permits to search other public desktops
     */
    var searchBar = function(){
	var search = $('#name');
	var timeout;

	search.val('Search for public Skytoop');
	search.focus(function(){
	    if(this.value == 'Search for public Skytoop') {this.value = '';}
	    $('#desktop').one('dblclick',function(e){
		$('#suggestions').children().fadeOut('fast').remove();
	    });
	});
	search.blur(function(){
	    if (this.value == '')
		this.value = 'Search for public Skytoop';
	});
	search.keyup(function(){
	    ajax(global_urls.location.public_search, ['name'], 'suggestions')
	    $('#suggestions').show();
	});

	$('#suggestions').mouseleave(function(){
	    var self = $(this);
	    timeout = setTimeout(function(){
		self.slideUp().empty();
		search.val('Search for public Skytoop');
		search.blur();
	    }, 1000);
	}).mouseenter(function(){
	    clearInterval(timeout);
	});
	// prevent refresh page if form submited (/!\)
	search.parent().parent().find('#search-pub-form').submit(function(e){	    
	    e.preventDefault();
	});
    }

    /*
     * Right click desktop handling
     */
    var rightClick = function(){
	$(document).bind('contextmenu', function(event) {
	    event.preventDefault();
	    
	    $("#custom-menu").remove();
	    
	    $(menu).appendTo("body").css({top: event.pageY - 55 + "px", 
					  left: event.pageX - 95 + "px"});

	    var cus_menu = $("#custom-menu");

	    // Create new icon
	    cus_menu.find('#cnf').click(function(event) {
		cus_menu.remove();			
		Skytoop.util.new_icon(event.pageX, event.pageY);
		return false;
	    });
	    
	    // Delete icon
	    cus_menu.find('#cnl').click(function(event, el){
		cus_menu.remove();
		act_icon.fadeOut('slow').remove();
		indicator.add_process();
		$.ajax({
		    type: "GET",
		    url : ajax_urls.icon.delete_icon,
		    data : "id=" + act_icon.attr("id"),
		    success : function(){
			indicator.rm_process();
		    }
		});
		return false;
	    });
	    
	    // Add new sticky note
	    cus_menu.find('#cnn').click(function(event){
		cus_menu.remove();
		var x = (Math.round(((event.pageX - 50) / window.innerWidth) * 10) * 10);
		var y = (Math.round(((event.pageY - 70) / window.innerHeight) * 10) * 10);
		desktop.stickynote({
		    syncX : x,
		    syncY : y
		});
		return false;			
	    });
	    
	    // if extern click remove menu
	    desktop.click(function(){
		cus_menu.remove();
	    });
	});	
    }
    /*
     * Right panel control
     */
    var rightMinPanel = function(){

	$('#add-apps', min_pan).click(function(){
notify('Not implemented yet !');
//           desktop.find('#apps-select').toggle('slow');
	});
	
	$('#draw-shape', min_pan).click(function(e){
	    //loadDynJs('../static/widgets/drawZone/jquery.drawZone.js');
	notify('Now click on the desktop and make the zone bigger from the left to the right!');
	    draw_zone.init();
	    draw_zone.runDrawShapes();
	});
	
	$('#new-note-desk', min_pan).mousedown(function(e){	    
	    //loadDynJs('../static/widgets/notes/jquery.stickynote.js');
	    var cote = 0.18 * window.innerHeight;
	    var stick_tmp = '<img id="img-sticky-tmp"';
	    stick_tmp += 'style="position : absolute;z-index:0;"';
	    stick_tmp += 'src="' + gl_pm.default_note_img + '" width="' + cote + '"/>';
	    desktop.append(stick_tmp);

	    $('#img-sticky-tmp')
		.css('top', e.pageY - (cote / 2))
		.css('left', e.pageX - (cote / 2));

	    desktop.mousemove(function(e){
		$('#img-sticky-tmp')
		    .css('top', e.clientY - (cote / 2))
		    .css('left', e.clientX - (cote / 2));
	    });		    
	    desktop.click(function(e){
		desktop.unbind('mousemove');
		$('#img-sticky-tmp').remove();
		desktop.stickynote({
		    syncX : (Math.round(((e.pageX - 50) / window.innerWidth) * 10) * 10),
		    syncY : (Math.round(((e.pageY - 70) / window.innerHeight) * 10) * 10)
		});
		desktop.unbind('click');
		return false;
	    });
	    return false;
	});

	// New icon
	$('#new-icon-desk', min_pan).click(function(e){
	    var cote = 0.020 * window.innerWidth;
	    var icon_tmp = '<img id="icon-sticky-tmp"';
	    icon_tmp += 'style="position:absolute;z-index:0;"';
	    icon_tmp += 'src="' + gl_pm.default_icon_img + '" width="' + cote + '"/>';
	    
	    notify('Click where you want to put the new icon',3500);
	    desktop.append(icon_tmp);
	    $('#icon-sticky-tmp')
		.css('top', e.pageY - (cote / 2))
		.css('left', e.pageX - (cote / 2));
	    desktop.mousemove(function(e){
		$('#icon-sticky-tmp')
		    .css('top', e.clientY - cote)
		    .css('left', e.clientX - (cote / 2));
	    });
	    desktop.click(function(e){
		desktop.unbind('mousemove');
		$('#icon-sticky-tmp').remove();
		Skytoop.util.new_icon(e.pageX - 35, e.pageY - 40);
		desktop.unbind('click');
		return false;
	    });
	    return false;
	});

	// FOR PUBLIC
	// $('#back-to-private', min_pan).click(function(){
	//     modalize(0.8);
	//     window.location = global_urls.location.index;
	//     return false;
	// });

	// // FOR PRIVATE
	// $('#go-to-public', min_pan).click(function(){
	//     modalize(0.8);
	//     window.location = global_urls.location.get_public_url;
	//     return false;
	// });

	// $('#go-to-logout', min_pan).click(function(){
	//     modalize(0.8);
	//     window.location = global_urls.location.logout;
	//     return false;
	// });

	$('#back-to-search', min_pan).click(function(){
	    modalize(0.8);		   
	    window.location = global_urls.location.search;
	});
    }

    return {
	rightMinPanel : rightMinPanel,
	rightClick : rightClick,
	searchBar : searchBar,
	wallpaper : wallpaper,
	appStore : appStore
    }
}();
