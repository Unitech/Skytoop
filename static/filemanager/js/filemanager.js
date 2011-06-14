/*---------------------------------------------------------
  Configuration
  ---------------------------------------------------------*/

// Set this to the server side language you wish to use.
var lang = 'py'; // options: lasso, php, py

// Set this to the directory you wish to manage.
var fileRoot = '/';

// Show image previews in grid views?
var showThumbs = false;

/*---------------------------------------------------------
  Setup, Layout, and Status Functions
  ---------------------------------------------------------*/

// Options for alert, prompt, and confirm dialogues.
$.SetImpromptuDefaults({
    overlayspeed: 'fast',
    show: 'fadeIn',
    opacity: 0.4
});

// Forces columns to fill the layout vertically.
// Called on initial page load and on resize.
var setDimensions = function(){
    var newH = $(window).height() - 70; 
    $('#splitter #filetree, #fileinfo, .vsplitbar').height(newH);
    var newW= $(window).width() - ($("#filetree").width() + 6 );
    $("#fileinfo").width(newW - 34);
}

var setUploader = function(path){
    $('#currentpath').val(path);
    
    /*
     * Here MAC NAVIGATOR LIKE
     *
     */
    var tmp = path.split("/");
    var res = '';
    var pth = '/';    

    for (i = 0; i < tmp.length; i++){
	if (tmp[i].length > 1){
	    if (tmp[i].charAt(0) == '/')
		pth += '/' + tmp[i] + '/';
	    else
		pth += tmp[i] + '/';
	    res += '<a id="select_folder_mac" onclick="getFolderInfo(\''+ pth + '\');">/' + tmp[i] + '</a>';
	}
    }
    $('#path_mac').html(res);
    /*
     * END
     *
     */




    /*
     * New folder creation
     * 
     */
    
    $('#new-folder-speed').unbind().click(function(){
        var foldername = 'My Folder';
        var msg = 'Enter the name of the new folder: <input id="fname" name="fname" type="text" value="' + foldername + '" />';
        
        var getFolderName = function(v, m){
            if(v != 1) return false;        
            var fname = m.children('#fname').val();     

            if(fname != ''){
                foldername = fname;

                $.getJSON("filemanager/call/json/addfolder/True?path=" + $('#currentpath').val() + '&name=' + foldername, function(result){
                    if(result['Code'] == 0){
                        addFolder(result['Parent'], result['Name']);
                        getFolderInfo(result['Parent']);
                    } else {
                        $.prompt(result['Error']);
                    }               
                });
            } else {
                $.prompt('No folder name was provided.');
            }
        }
        
        $.prompt(msg, {
            callback: getFolderName,
            buttons: { 'Create Folder': 1, 'Cancel': 0 }
        });
    });
    /*
     *
     * END
     *
     */ 
}





//function to download files
var download = function(path){
    filename=path.substr(path.lastIndexOf('/')+1);
    downloadurl = 'filemanager/downloadurl?filename=' + filename ;

    if (window.XMLHttpRequest)
	xmlhttp=new XMLHttpRequest();
    else
	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    
    xmlhttp.open("POST",downloadurl,true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            window.location=location.protocol+'//'+location.host+'/'+appname+'/filemanager/download/'+xmlhttp.responseText;
            //window.location = location.protocol+'//'+location.host+xmlhttp.responseText;
        }
    }
}    

// Converts bytes to kb, mb, or gb as needed for display.
var formatBytes = function(bytes){
    var n = parseFloat(bytes);
    var d = parseFloat(1024);
    var c = 0;
    var u = [' bytes','kb','mb','gb'];
    
    while(true){
        if(n < d){
            n = Math.round(n * 100) / 100;
            return n + u[c];
        } else {
            n /= d;
            c += 1;
        }
    }
}

// function to retrieve GET params
$.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
}


/*---------------------------------------------------------
  Item Actions
  ---------------------------------------------------------*/


// Renames the current item and returns the new name.
// Called by clicking the "Rename" button in detail views
// or choosing the "Rename" contextual menu option in 
// list views.
var renameItem = function(data){
    var finalName = '';
    var msg = 'Enter a new name for the file: <input id="rname" name="rname" type="text" value="' + data['Filename'] + '" />';
    var getNewName = function(v, m){
        if(v != 1) return false;
        rname = m.children('#rname').val();
        
        if(rname != ''){
            var givenName = rname;  
            
            var connectString = "filemanager/call/json/rename/True?old=" + data['Path'] + '&new=' + givenName;
            
            $.ajax({
                type: 'GET',
                url: connectString,
                dataType: 'json',
                async: false,
                success: function(result){
                    if(result['Code'] == 0){
                        var oldPath = result['Old Path'];
                        var newPath = result['New Path'];
                        var newName = result['New eName'];
                        var parentpath=result['parent']
                        if (result['type']=='dir'){
                            updateNode(oldPath, newPath, newName);}
                        
                        if($('#fileinfo').data('view') == 'grid'){
                            $('#fileinfo img[alt="' + oldPath + '"]').next('p').text(newName);
                            $('#fileinfo img[alt="' + oldPath + '"]').attr('alt', newPath);
                        } else {
                            $('#fileinfo td[title="' + oldPath + '"]').text(newName);
                            $('#fileinfo td[title="' + oldPath + '"]').attr('title', newPath);
                        }
                        if (result['type']=='file'){
                            getFolderInfo(parentpath); 
                        }              
                        //$.prompt('Rename successful.');
                    } else {
                        $.prompt(result['Error']);
                    }
                    
                    finalName = result['New eName'];     
                }
            }); 
        }
    }
    
    $.prompt(msg, {
        callback: getNewName,
        buttons: { 'Rename': 1, 'Cancel': 0 }
    });
    
    return finalName;
}

/*
 *
 *
 * Called for deletion
 *
 *
 */
var deleteItem = function(data){
    var isDeleted = false;
    var msg = 'Are you sure you wish to delete this file?';
    var connectString = "filemanager/call/json/delete/True?path=" + data;
    $.ajax({
        type: 'GET',
        url: connectString,
        dataType: 'json',
        async: false,
        success: function(result){
            if(result['Code'] == 0){
                removeNode(result['Path']);
                //getFolderInfo($('#currentpath').val());
                isDeleted = true;
		//    $.prompt('Delete successful.');
            } else {
                isDeleted = false;
                $.prompt(result['Error']);
            }           
        }
    });     
    return isDeleted;
}





/*---------------------------------------------------------
  Functions to Update the File Tree
  ---------------------------------------------------------*/

// Adds a new node as the first item beneath the specified
// parent node. Called after a successful file upload.
var addNode = function(path, name){
    var ext = name.substr(name.lastIndexOf('.') + 1);
    var thisNode = $('#filetree').find('a[rel="' + path + '"]');
    var parentNode = thisNode.parent();
    //var newNode = '<li class="file ext_' + ext + '"><a rel="' + path + name + '/" href="#">' + name + '/</a></li>';
    
    if(!parentNode.find('ul').size()) parentNode.append('<ul></ul>');       
    //parentNode.find('ul').prepend(newNode);
    thisNode.click().click();

    getFolderInfo(path);

}

// Updates the specified node with a new name. Called after
// a successful rename operation.
var updateNode = function(oldPath, newPath, newName){
    var thisNode = $('#filetree').find('a[rel="' + oldPath + '"]');
    var parentNode = thisNode.parent().parent().prev('a');
    thisNode.attr('rel', newPath).text(newName);
    parentNode.click().click();
}

// Removes the specified node. Called after a successful 
// delete operation.
var removeNode = function(path){
    $('#filetree')
        .find('a[rel="' + path + '"]')
        .parent()
        .fadeOut('slow', function(){ 
            $(this).remove();
        });
}

// Adds a new folder as the first item beneath the
// specified parent node. Called after a new folder is
// successfully created.
var addFolder = function(parent, name){
    var newNode = '<li class="directory collapsed"><a rel="' + parent + name + '/" href="#">' + name + '</a><ul class="jqueryFileTree" style="display: block;"></ul></li>';
    var parentNode = $('#filetree').find('a[rel="' + parent + '"]');

    if(parent != fileRoot){
        parentNode.next('ul').prepend(newNode).prev('a').click().click();
    } else {
        $('#filetree > ul').append(newNode);
        
    }
}

/******************************************************************************
 *
 * Functions to get Detail file informations 
 *
 ******************************************************************************/

var getFileInfo = function(file){

    // Update location for status, upload, & new folder functions.
    var currentpath = file.substr(0, file.lastIndexOf('/') + 1);
    setUploader(currentpath);
    
    // Include the template.
    var template = '<div id="preview"><div id="result" style="display:inline,color:red;"></div><input id="getpath" type="hidden" ></input><input id="senddata" type="hidden" ></input><img /><h1></h1><dl></dl></div>';
    template += '<form id="toolbar">';
    template += '<button id="rename" type="button">Back</button>';
    template += '<button id="download" type="button">Download</button>';
    template += '<button id="delete" type="button" value="Delete">Delete</button>';
    template += '<button id="wallpaper-tb" type="button">Set as Wallpaper</button>';
    template += '</form>';

    var test = '<div id="waiting-files"></div>';
    //$(.html(test);    
    $('#fileinfo').html(template);
    
    // Retrieve the data & populate the template.
    $.ajax({
	type : "GET",
	data : "path=" + file,
	dataType : 'json',
	url : 'filemanager/getFileInfo.json',
	success : function(data){
	    $('#fileinfo').find('h1').text(data['Filename']);
            if (data['FileType']=='media') {
		$(data['FilePreview']).insertBefore('#fileinfo img');
		$("#fileinfo img").remove();}
            else {
		$('#fileinfo').find('img').attr('src',data['Preview']);}
	    
            /*var properties = '';
            if (data['Size'] && data['Size'] != '')
		properties += '<dt>Size</dt><dd>' + formatBytes(data['Size']) + '</dd>';*/
            bindToolbar(data, currentpath);
	},
	error : function(data) {
	    alert('Error, it will be fixed soon. AS.');
	}
    });    
}

/*
 *
 * Toolbar after Data details
 *
 */
var bindToolbar = function(data, currentpath){
    var tool = $('#toolbar');

    tool.find('#rename').click(function(){
	getFolderInfo(currentpath);
    });

    tool.find('#delete').click(function(){
        if (deleteItem(data['Path']))
	    getFolderInfo(currentpath);
    });

    tool.find('#download').click(function(){
        download(data['Path']);
    });

    tool.find('#wallpaper-tb').click(function(){
	set_new_wallpaper(data['Path']);
    });
}


/*
 * FOLDER or FILE detail (if Folder or File)
 */
var getDetailView = function(path){
    if (path.lastIndexOf('/') == path.length - 1) {
	// Display folder content
        getFolderInfo(path);
        $('#filetree').find('a[rel="' + path + '"]').click();
    } else {
	// Display File info
        getFileInfo(path);
    }
}



/*******************************************************************
 *
 *			Wallpaper Functions  
 *
 *******************************************************************/
var set_new_wallpaper = function(path){
    modalize();

    function terminate(){
	$('.add-icon-box').fadeOut(150).remove();
	$('#mask').fadeOut(250);
	$('#mask').hidde();
    }

    var box = "<div class='add-icon-box'>";
    box += "<div id='exit-add'> X </div>";
    box += "<center><b>Change wallpaper</b></center><br/>";
    box += "Image position :";
    box += "<center><div id='position-choice'>";
    box += '<span id="choice-0" class="top-left zone-choice zone-choice-selected" title="left top"></span>';
    box += '<span id="choice-1" class="top-right zone-choice" title="right top"></span>';
    box += '<span id="choice-2" class="bottom-right zone-choice" title="right bottom"></span>';
    box += '<span id="choice-3" class="bottom-left zone-choice" title="left bottom"></span>';
    box += '<span id="choice-4" class="center zone-choice" title="center center"></span>';
    box += '</div></center>';
    box += '<br/>';
    box += "Background-color :";
    box += "<span id='color-picker'></span><br/>";
    box += "<input type='text' id='color' name='color' value='#123456' />";
    box += "<br/>";
    box += "<button type='button' id='private-wallpaper'>Set as wallpaper</button><br/>";
    box += "</div>";

    var position = "left top";
    $(box).appendTo("body");

    var i = 0;
    for  (i = 0; i < 5; i++){
	$('#choice-' + i).click(function(e){
	    $('#position-choice').find('.zone-choice-selected').removeClass('zone-choice-selected');
	    $(this).addClass('zone-choice-selected');
	    position = $(this).attr('title');
	});
    }

    $('#color-picker').farbtastic('#color');

    $('#private-wallpaper').click(function(e){
	$.ajax({
	    type : "POST",
	    data : 'path=' + path  + '&backcol=' + $('#color').val() + '&position=' + position,
	    url : '/Skytoop/custom/change_wallpaper',
	    success : function(data){
		terminate();
	    }	
	});	
    });

    
    $('#exit-add').click(terminate);
    $('#mask').click(terminate);
}

// Binds contextual menus to items in list and grid views.
var setMenus = function(action, path){
        if($('#fileinfo').data('view') == 'grid'){
            var item = $('#fileinfo').find('img[alt="' + path + '"]').parent();
        } else {
            var item = $('#fileinfo').find('td[title="' + path + '"]').parent();
        }
	
        switch(action){
        case 'download':
            download(path);
            break;
            
        /*case 'rename':
            var newName = renameItem();
            break;*/
            
        case 'delete':
	    item.fadeOut('slow', function(){ $(this).remove(); });
	    deleteItem(path);
            break;
	case 'wallpaper':
	    set_new_wallpaper(path);
	    break;
        }
}



/***************************************************************
 *
 *	Folder content displaying
 *
 ***************************************************************/
var getFolderInfo = function(path){
    // Update location for status, upload, & new folder functions.
    setUploader(path);
    var file_f = $('#fileinfo');
    
    $.ajax({	
	url : "filemanager/call/json/getfolder",
	dataType : 'json',
	data : "path=" + path,
	beforeSend: function(){
	    // Remove grid + display wait gif
	    $('#fileinfo tbody').fadeOut('fast').remove();
            $('#fileinfo thead').fadeOut('fast').remove();	    
	    file_f.html('<div id="waiting-files"></div>');
	},	
	success : function(data){
	    file_f.fadeTo("fast", 1).css({'background-color':'white'});
            var result = '';
	    var i = 0;
	    for (key in data) i++;
				
	    if (i > 0){       
		result += '<table id="contents" class="list">';
                result += '<thead>';
		result += '<tr><th class="headerSortDown"><span>Name</span></th>';
		result += '<th><span>Size</span></th></tr></thead>';
                result += '<tbody>';
                
                for (key in data){
		    var path = data[key]['Path'];
		    var props = data[key]['Properties'];
		    var scaledWidth = 20;
		    
		    result += '<tr>';
		    result += '<td title="' + path + '">';
		    result += '<img src="' + data[key]['Preview'] + '" width="';
		    result += scaledWidth + '" alt="' + data[key]['Path'] + '" /> ';
		    result += data[key]['Filename'] + '</td>';		    
                    result += '<td></td>';
		    
		    if (data[key]['Size'] && data[key]['Size'] != ''){
			result += '<td><abbr title="' + data[key]['Size'] + '">';
			result += formatBytes(data[key]['Size']) + '</abbr></td>';
		    }
		    else
                        result += '<td></td>';
                    result += '<td></td>';
		    result += '</tr>';              
                }                    
                result += '</tbody>';
                result += '</table>';
	    }
	    else{
		result += '<h1>No files, upload them !</h1>';
	    }
            
            // Add the new markup to the DOM.
            file_f.html(result);
            
            // Bind click events to create detail views and add
            // contextual menu options.
            if (file_f.data('view') == 'grid'){
		file_f.find('#contents li').click(function(){
		    var path = $(this).find('img').attr('alt');
		    getDetailView(path);
		}).contextMenu({ menu: 'itemOptions' }, function(action, el, pos){
		    var path = $(el).find('img').attr('alt');
		    setMenus(action, path);
		    return false;
		});
            } else {
		$('#fileinfo tbody tr').click(function(){
                    var path = $('td:first-child', this).attr('title');
                    getDetailView(path);        
		}).contextMenu({ menu: 'itemOptions' }, function(action, el, pos){
                    var path = $('td:first-child', el).attr('title');
                    setMenus(action, path);
		    return false;
		});
		
		// SORT en mode grille
		file_f.find('table').tablesorter({
                    textExtraction: function(node){                 
			if($(node).find('abbr').size()){
                            return $(node).find('abbr').attr('title');
			} else {                    
                            return node.innerHTML;
			}
                    }
		});
            }
	}});
};


/***************************************************************
 *
 *	Initialization
 *
 ***************************************************************/
$(function(){
    // Adjust layout.
    var grid = $('#grid');

    setDimensions();
    $(window).resize(setDimensions);

    $('#splitter').splitter({
	// WIDTH SPLIT LEFT COLUMN
	
	initA: 130
    });

    $('button').wrapInner('<span></span>');

    // Set initial view state.
    $('#fileinfo').data('view', 'list');

    // Set buttons to switch between grid and list views.
    grid.click(function(){
        $(this).addClass('ON');
        $('#list').removeClass('ON');
        $('#fileinfo').data('view', 'grid');
        getFolderInfo($('#currentpath').val());
    });
    
    $('#list').click(function(){
	$(this).addClass('ON');
	grid.removeClass('ON');
	$('#fileinfo').data('view', 'list');
	getFolderInfo($('#currentpath').val());
    });

    // Provide initial values for upload form, status, etc.
    setUploader(fileRoot);
    // Creates file tree.
    $('#filetree').fileTree({
        root: fileRoot,
        script: 'filemanager/dirlist',
	//multiFolder: false,
	collapseSpeed : 0,
	expandSpeed : 0,
	folderCallback: function(path){ 
	    getFolderInfo(path);
	},
        after: function(data){
	    /*$('#filetree').find('li a').contextMenu(
              { menu: 'itemOptions' }, 
              function(action, el, pos){
              var path = $(el).attr('rel');                    
              setMenus(action, path);
	      }
	      );*/
        }
    }, function(file){
	//getFileInfo(file);
    });
    getFolderInfo("/");
    setUploader("/");
});

function modalize(op){
    op = typeof(op) != 'undefined' ? op: 0.7;
    var maskHeight = $(window).height() - 10;  
    var maskWidth = $(window).width() - 10;  
    var mask = $('#mask');
    mask.css({'width':maskWidth,'height':maskHeight});  
    mask.fadeTo("fast",op);
    mask.show();
}

$('#mask').click(function () {  
    $('#mask').fadeOut('fast');    
});           