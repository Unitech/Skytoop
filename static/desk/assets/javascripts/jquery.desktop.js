
/*
 *
 * Skytoop main lib
 * by Strzelewicz Alexandre
 * Since 01/01/2011
 *
 */

var Skytoop = (function($, window, undefined) {
    return {
	go: function() {
	    for (var i in Skytoop.init) {
		Skytoop.init[i]();
	    }
	},
	winSys: function(options){
	    windowHandling.buildWindow(options);
	},
	init: {
	    desktop: function() {		
		iconHandling.handleDesktopIcons();
	    },
	    app_store : function(){
		desktopHandling.appStore();
	    },
	    search_bar : function(){
		desktopHandling.searchBar();
	    },
	    right_click : function(){
		desktopHandling.rightClick();
	    },
	    right_min_panel: function(){
		desktopHandling.rightMinPanel();
	    },
	    window_manager: function(){
		windowHandling.windowManager();
	    },
	    wallpaper: function() {
		desktopHandling.wallpaper();
	    },
	},
	util: {
	    get_desktop_content : function(id){
		$.ajax({
		    type : "GET",
		    url : '/Skytoop/widget/get_widget.json',
		    dataType : 'json',
		    success : function(data){
      			for (var i = 0; i < data.widgets.length; i++){
			    var u = data.widgets[i];

			    $('#desktop').widgetGen({
				syncType :  u.type,
				syncX : u.x,
				syncY : u.y,
				syncWidth : u.width,
				syncHeight : u.height,
				syncTitle : u.title,
				syncData1 : u.data1,
				syncData2 : u.data2,
				syncData3 : u.data3,
				syncId : u.id
			    });
			}
		    }
		});

		$.ajax({
    		    type : "GET",
    		    url : '/Skytoop/icons/get_icon.json',
    		    dataType : 'json',
    		    success : function(data){

			iconized.begin_icons = data.icons.length;
			iconized.tmp_icons = data.icons.length;
			if (iconized.begin_icons < 3 && publicView == true && modif == true){
			    notify('You have to create at least 3 valid icons to swith ON your public Skytoop !', 4500);
			}

    			for (var i = 0; i < data.icons.length; i++){
    			    var ico = data.icons[i];

			    new Icon({
				IconX: ico.x,
				IconY : ico.y,
				Url : ico.url,
				IconId : ico.id,
				IconTitle : ico.title,
				IconImg : ico.logo_link,
				ExternalIcon : ico.direct_link
			    });
    			} 
    		    }
		});
	    },
	    new_icon: function(x, y, url_get){
		iconHandling.newIcon(x, y, url_get);
	    },
	    stop_act: function() {
		$('a.active, tr.active').removeClass('active');
		$('ul.menu').hide();
	    },
	    window_flat: function() {
		windowHandling.windowFlat();
	    },
	    window_resize: function(el) {
		windowHandling.windowResize(el);
	    }
	}
    };
})(jQuery, this);
