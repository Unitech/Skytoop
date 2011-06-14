
/******************************************************************
 * 
 *         For the remarks at the bottom right of the desktop
 *
 ******************************************************************/

function feedback(){
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
 * If an url is passed in GET arguments 
 * from Chrome extension
 */

function url_from_chrome(){

    function gup( name )
    {
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );
	if( results == null )
	    return "";
	else
	    return results[1];
    }

    // In case if URL passed by chrome extension

    var url = unescape(gup('url'));

    if (url != ''){
	var cote = 0.020 * window.innerWidth;
	var icon_tmp = '<img id="icon-sticky-tmp"';
	icon_tmp += 'style="position:absolute;z-index:0;"';
	icon_tmp += 'src="' + gl_pm.default_icon_img + '" width="' + cote + '"/>';
	
	notify('Click where you want to put the new icon',3500);
	$('#desktop').append(icon_tmp);

	$('#icon-sticky-tmp')
	    .css('top', window.event.clientY - (cote / 2))
	    .css('left', window.event.clientX - (cote / 2));


	$('#desktop').mousemove(function(e){
	    $('#icon-sticky-tmp')
		.css('top', e.clientY - cote)
		.css('left', e.clientX - (cote / 2));
	});

	$('#desktop').click(function(e){
	    $(this).unbind('mousemove');
	    $('#icon-sticky-tmp').remove();
	    Skytoop.util.new_icon(e.pageX - 35, e.pageY - 40, url);
	    $(this).unbind('click');
	});
    }

}


/******************************************************************
 * 
 *                     Misc Funcs
 *
 ******************************************************************/

/*
 * Placeholder
 *
 */
function set_auto_text(el, str_cmt)
{
    el.val(str_cmt);

    el.focus(function(){
        if(this.value == str_cmt) {
            this.value = '';
        }
    });
    el.blur(function(){
        if (this.value == '') {
            this.value = str_cmt;
        }
    });
}


/*
 * Randomization
 */
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function guid() {
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

/*
 * Global Ajax URLS
 *
 * Default is private urls
 * if you call setPublic then urls change to access to public desktop
 *
 */

var act_icon;

var gl_pm = {
    app_mame : '',
//    default_icon_img : '/Skytoop/static/desk/assets/images/icons/32-blog.png',
    default_icon_img : '/Skytoop/static/earth.png',
    default_note_img : '/Skytoop/static/widgets/notes/images/stickynote-medium.png',
    waiting_img : '/Skytoop/static/wait2.gif'
}

var ajax_urls = {
    // ICONS
    switchpublic : '/Skytoop/custom/set_public',
    icon : {
	new_icon: '/Skytoop/icons/new_icon',
	modify_icon : '/Skytoop/icons/modify_icon',
	delete_icon : '/Skytoop/icons/delete_icon'
    },
    widget : {
	note : {
	    new_note : '/Skytoop/widget_note/new_note',
	    modify_note : '/Skytoop/widget_note/modify_note',
	    delete_note : '/Skytoop/widget_note/delete_note'
	},
	zone : {
	    new_zone : '/Skytoop/widget_zone/new_zone',
	    modify_zone : '/Skytoop/widget_zone/modify_zone',
	    delete_zone : '/Skytoop/widget_zone/delete_zone'
	}
    },
    // Dont need public vote
    votes : {
	up_vote : '/Skytoop/vote_log/up',
	down_vote : '/Skytoop/vote_log/down'
    },
    setPublic : function(){
	// ICONS
	ajax_urls.icon.new_icon = '/Skytoop/icons/new_icon_pub';
	ajax_urls.icon.modify_icon = '/Skytoop/icons/modify_icon_pub';
	ajax_urls.icon.delete_icon = '/Skytoop/icons/delete_icon_pub';
	// Note - Widget
	ajax_urls.widget.note.new_note = '/Skytoop/widget_note/new_note_pub';
	ajax_urls.widget.note.modify_note = '/Skytoop/widget_note/modify_note_pub';
	ajax_urls.widget.note.delete_note = '/Skytoop/widget_note/delete_note_pub';
	// Zone - Widget
	ajax_urls.widget.zone.new_zone = '/Skytoop/widget_zone/new_zone_pub';
	ajax_urls.widget.zone.modify_zone = '/Skytoop/widget_zone/modify_zone_pub';
	ajax_urls.widget.zone.delete_zone = '/Skytoop/widget_zone/delete_zone_pub';
    }
}



/******************************************************************
 * 
 *         Operations pending handling
 *
 ******************************************************************/

var operation_pending = {
    start : function(){
	this.id = $('#wallpaper');
	this.id.fadeOut(2200).fadeIn(2200);
	this.break_wallpaper = setInterval(function() {
	    $('#wallpaper').fadeOut(2200).fadeIn(2200);
	}, 4400);
    },
    finish : function(){
	clearInterval(this.break_wallpaper);
    }
};


var indicator = {
    process : 0,
    activity : 0,
    rm_process : function(){
	indicator.process = indicator.process - 1;
    },
    add_process : function(){
	indicator.process = indicator.process + 1;
    },
    start_analyse : function(){
	if (indicator.process > 0){
	    if (indicator.activity == 0){
		indicator.activity = 1;
		operation_pending.start();
	    }
	}
	else{
	    operation_pending.finish();
	    indicator.activity = 0;
	}
	setTimeout(indicator.start_analyse, 1200);
    }
}



/******************************************************************
 * 
 *         Desk clock
 *
 ******************************************************************/

function desk_clock(){
    var date_obj = new Date();
    var hour = date_obj.getHours();
    var minute = date_obj.getMinutes();
    var day = date_obj.getDate();
    var year = date_obj.getFullYear();
    var suffix = 'AM';
    
    var weekday = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday'
    ];
    
    var month = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
    ];
    
    weekday = weekday[date_obj.getDay()];
    month = month[date_obj.getMonth()];
    if (hour >= 12)
	suffix = 'PM';
    if (hour > 12)
	hour = hour - 12;
    else if (hour === 0)
	hour = 12;
    if (minute < 10)
	minute = '0' + minute;
    var clock_time = weekday + ' ' + hour + ':' + minute + ' ' + suffix;
    var clock_date = month + ' ' + day + ', ' + year;
    
    $('#clock').html(clock_time).attr('title', clock_date);
    setTimeout(desk_clock, 60000);
}


/******************************************************************
 * 
 *         Notification manager
 *
 ******************************************************************/

function notify(str, time){
    time = typeof(time) != 'undefined' ? time : 2200;
    var note = $('#notify-man');
    note.html(str);
    note.css("left", ( $(window).width() - note.width() ) / 2+$(window).scrollLeft() + "px");
    note.delay(150).show("drop",  {direction : "up"} , 500).delay(time).hide("drop", {direction : "up"}, 500);
    note.live('mouseover', function(){$(this).hide(); $(this).die()});
    return false;
}


/******************************************************************
 * 
 *         Main to exec on pub or private Desktop
 *
 ******************************************************************/

function modalize(op){
    op = typeof(op) != 'undefined' ? op: 0.7;
    var maskHeight = $(document).height();  
    var maskWidth = $(window).width();  
    $('#mask').css({'width':maskWidth,'height':maskHeight});  
    $('#mask').fadeTo("fast",op);    
}
$('#mask').click(function () {  
    $('#mask').fadeOut('fast');    
});           

