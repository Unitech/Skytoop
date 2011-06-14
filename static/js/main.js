
/*
 * Iconized pour savoir s'il y a eu plus de 3 icone de crees
 */

 var iconized = {
      begin_icons : 0,
      tmp_icons : 0
      };


var main = function(){

    $('#url-ls').append(location.href);
    // Default setup for Ajax req
    $.ajaxSetup({
	type: "POST",
	global : false
    });

    // Load widgets + icon
    Skytoop.util.get_desktop_content();
    // Construct windows
    Skytoop.go();

    // Init desk clock
    desk_clock();
    // Init operation indicator handling
    indicator.start_analyse();
    // Is it an url on GET parameters (chrome plugin)
    url_from_chrome();
    // Init feedbacks box
    feedback();

    
    if (modif == true){
	new Skytoop.winSys({
	    WindowTitle: 'Cloudy Disk',
       	    IconId : '1',
	    IconX : '1',
	    IconY : '2',
	    Movable : false,
	    TemplateUrl : '/Skytoop/filemanager',
	    IconImg : '/Skytoop/static/desk/assets/images/icons/cloud-32.png'
	});
    }
    
    // if (publicView == false){
    // 	new Skytoop.winSys({
    // 	    WindowTitle: 'Skytoop Wiki',
    //         IconId : '1',
    // 	    IconX : '1',
    // 	    IconY : '11',
    // 	    Movable : false,
    //         TemplateUrl : 'http://wiki.skytoop.com',
    //         IconImg : '/Skytoop/static/desk/assets/images/icons/32-brain.png'
    // 	});
    // }
   
};