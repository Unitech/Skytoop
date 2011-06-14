/*
 *
 * Zone drawing widget
 *
 */


(function($) {
    $.fn.drawZone = function(options) {
	var opts = $.extend({}, $.fn.drawZone.defaults, options);
	return this.each(function() {
	    $this = $(this);
	    var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
	    $.fn.drawZone.createZone(o);
	});
    };
    $.fn.drawZone.defaults = {
	syncType : 'zone',
	syncX : 0,
	syncY : 0, 
	syncWidth	: 0,
	syncHeight	: 0,
	syncTitle	: 'Default title',
	syncId	: 0,
	xTmp	: 0,
	yTmp	: 0,
	widthTmp : 0,
	heightTmp :0
    };
    $.fn.drawZone.createZone = function(o) {
	
	if (o.syncX == 0 && o.syncY == 0){
	    o.syncX = Math.round((o.xTmp / window.innerWidth) * 100);
	    o.syncY = Math.round((o.yTmp / window.innerHeight) * 100);
	    o.syncWidth = Math.round((o.widthTmp / window.innerWidth) * 100);
	    o.syncHeight = Math.round((o.heightTmp / window.innerHeight) * 100);
	}
	else {
	    o.xTmp = o.syncX / 100 * window.innerWidth;
	    o.yTmp = o.syncY / 100 * window.innerHeight;
	    o.widthTmp = o.syncWidth / 100 * window.innerWidth;
	    o.heightTmp = o.syncHeight / 100 * window.innerHeight;
	}

	var rect = '';
	rect += "<div class='zone-selection' id='rect_" + o.syncId + "'";
	rect += "style='top : " + o.yTmp + "px;";
	rect += "left : " + o.xTmp + "px;";
	rect += "width : " + o.widthTmp + "px;";
	rect += "height : " + o.heightTmp + "px;";
	rect += "'>";
	rect += "<span class='title-zone'>" + o.syncTitle + "</span>";
	rect += "<span id='open-all' title='Open all links in this zone'>Open all</span>";
	rect += "<div class='zone-bottom-options'>";
	rect += "<span class='move-zone move-zone-" + o.syncId + "' title='Move Zone'></span>";
	rect += "<span class='resize-zone' title='Resize Zone'></span>";
	rect += "<span class='delete-zone' title='Delete Zone'></span>";
	rect += "</div>";
	rect += "</div>";
	rect += "</div>";

	var spe_rect = $(rect);

	spe_rect.find('.delete-zone').click(function(e){
	    draw_zone.init();
	    $.fn.drawZone.delete_e(o);
	});

	spe_rect.find('.title-zone').click(function(e){
	    if ($(this).css('opacity') != 1) {
		$(this).css({'opacity' : 1 });
		//$(this).unbind('click');
		var tmp = $(this).html();
		var edit = '<input type="text" id="modif-text-zone' + o.syncId + '" value="' + tmp + '">';
		$(this).html(edit);
		var p = $(this);

		var text_zone = $('#modif-text-zone' + o.syncId);

		function update_text(){
		    p.html(text_zone.val());
		    p.css({'opacity' : 0.9 });
		    o.syncTitle = text_zone.val();
		    $(document).widgetGen.update(o);
		    text_zone.die();
		}

		text_zone.focus();

		text_zone.live('change', function(e){
		    update_text();
		}).live('keypress', function(e){
		    if (e.which == '13')
			update_text();
		}).live('blur', function(){
		    update_text();
		});
	    }
	});
	
	spe_rect.find('#open-all').click(function(e){
	    var x_min = spe_rect.offset().left;
	    var x_max = spe_rect.offset().left + spe_rect.width();
	    var y_min = spe_rect.offset().top;
	    var y_max = spe_rect.offset().top + spe_rect.height();

	    $('#desktop a.icon').each(function(i, element){
		if ($(element).offset().left > x_min &&
		    $(element).offset().left < x_max &&
		    $(element).offset().top > y_min &&
		    $(element).offset().top < y_max){
		    // If icon in region open it
		    if ($(element).attr('href')[0] != '#')
			window.open($(element).attr('href'));
		}
	    });
	});
	
	spe_rect.find('.resize-zone').mousedown(function(e){
	    // deep copy
	    var tmp = $.extend({}, o);
	    $.fn.drawZone.delete_e(o);
	    draw_zone.resizeShape(tmp.xTmp, tmp.yTmp, tmp.syncTitle, e);
	    notify('Resize the zone by moving the mouse !');
	});

	$('#desktop').append(spe_rect);
	
        if (o.syncId == 0)
	    $(document).widgetGen.save(o, function(id){ o.syncId = id; $('#rect_0').attr('id', 'rect_' + id);});

	var x_min;
	var x_max;
	var y_min;
	var y_max;
	$('#rect_' + o.syncId).draggable({
	    handle : '.move-zone',
	    start : function(e){
		x_min = $(this).offset().left;
		x_max = $(this).offset().left + $(this).width();
		y_min = $(this).offset().top;
		y_max = $(this).offset().top + $(this).height();
	    },
	    stop : function(e){
		var new_zone = $(this);

		
		
	    $('#desktop a.icon').each(function(i, element){
		var n = $(element);
		/*
		 * Heavy load, mul each icon in zone per 1 query....
		 * Heavy load dom manipulation
		 */
		if (n.offset().left > x_min &&
		    n.offset().left < x_max &&
		    n.offset().top > y_min &&
		    n.offset().top < y_max){
		    if (n.attr('href')[0] != '#'){
			var x_after = parseFloat(n.css('left')) - x_min + new_zone.offset().left;
			var y_after = parseFloat(n.css('top')) - y_min + new_zone.offset().top;
			n.animate({'left' : x_after, 
				   'top':  y_after}, 1000);
			var x_perc = Math.round(x_after / window.innerWidth * 100);
			var y_perc = Math.round(y_after / window.innerHeight * 100);
			$.ajax({
			    type : "GET",
			    url : ajax_urls.icon.modify_icon,
			    data : {"x" : x_perc,
				    "y" : y_perc,
				    "id" : n.attr("id")}
			});
		    }
		}
	    });
		

		var x_perc = Math.round($(this).position().left / window.innerWidth * 100);
		var y_perc = Math.round($(this).position().top / window.innerHeight * 100);
		
		$(this).css({'left': x_perc / 100 * window.innerWidth, 
			     'top':y_perc / 100 * window.innerHeight});
		
		
		o.xTmp = $(this).position().left; 
		o.yTmp = $(this).position().top;
		o.syncX = x_perc; 
		o.syncY = y_perc; 
		$(document).widgetGen.update(o);
	    }
	});
    };
    $.fn.drawZone.delete_e = function(o){
    	$('#rect_' + o.syncId).remove();
	$(document).widgetGen.remove(o);
    	
    	};
})(jQuery);

/*
 *
 * Draw preview (fat - utilise SVG juste pour le preview )
 * a remplacer par du css movable (easy)
 *
 */
draw_zone = {
    drawStartPoint : null,
    drawEndPoint : null,
    shapeCount : 0,
    title : 'Default title',
    ip : 0,
    settings : {
	zone : '',
	svg : '',
	x_prev : 0,
	y_prev : 0
    },
    init : function(){
	draw_zone.settings.zone = $('#desktop');
	draw_zone.settings.zone.svg();
	draw_zone.settings.svg = draw_zone.settings.zone.svg('get');	
    },
    resizeShape : function(x, y, title, e){

	draw_zone.title = title;
	draw_zone.settings.zone = $('#desktop');
	draw_zone.settings.zone.svg();
	draw_zone.settings.svg = draw_zone.settings.zone.svg('get');

	draw_zone.settings.x_prev = x;
	draw_zone.settings.y_prev = y;	
	draw_zone.drawStartPoint = {X: x, Y: y}; 
	
	$('#desktop')
	    .live('mousemove', draw_zone.dragging)
	    .live('mouseup', draw_zone.endDrag);
	
    },
    runDrawShapes : function(){
	draw_zone.ip = 0;
	draw_zone.settings.zone
	    .live('mousedown', draw_zone.startDrag)
	    .live('mousemove', draw_zone.dragging)
	    .live('mouseup', draw_zone.endDrag);
    },
    startDrag : function(e){
	if (draw_zone.ip == 0) {
	    var offset = ($.browser.msie ? {left: 0, top: 0} : draw_zone.settings.zone.offset()); 
	    if (!$.browser.msie) { 
		offset.left -= document.documentElement.scrollLeft || document.body.scrollLeft; 
		offset.top -= document.documentElement.scrollTop || document.body.scrollTop; 
	    } 
	    draw_zone.settings.x_prev = e.clientX;
	    draw_zone.settings.y_prev = e.clientY;	
	    draw_zone.drawStartPoint = {X: draw_zone.settings.x_prev - offset.left, 
					Y: draw_zone.settings.y_prev - offset.top}; 
	    draw_zone.ip++;
	}
    },
    dragging : function(e){
	if(draw_zone.drawStartPoint != null){
	    var g = draw_zone.settings.svg.getElementById('selectArea');
	    
	    if(g != null)
		draw_zone.settings.svg.remove(g);
	    
	    draw_zone.drawEndPoint = {X: e.clientX - draw_zone.settings.x_prev, 
			    Y: e.clientY - draw_zone.settings.y_prev};	    

	    var selectArea = draw_zone.settings.svg.group(null, 'selectArea');
	    draw_zone.settings.svg.rect(selectArea, 
				    draw_zone.drawStartPoint.X, 
				    draw_zone.drawStartPoint.Y, 
				    draw_zone.drawEndPoint.X, 
				    draw_zone.drawEndPoint.Y,  
				    {fill: 'none', stroke: '#d59a45', 
				     strokeWidth: 2.5, strokeDashArray: '2,2',
				     rx: 15, ry : 15});
	}
    },
    endDrag : function(){
	if(draw_zone.drawStartPoint != null && draw_zone.drawEndPoint != null){
	    draw_zone.drawRectShape();
	    var g = draw_zone.settings.svg.getElementById('selectArea');
	    if (g != null)
		draw_zone.settings.svg.remove(g);
	    rawStartPoint = null;
	    draw_zone.drawEndPoint = null;
	    draw_zone.drawStartPoint = null;
	    draw_zone.settings.zone.die();
	}
    },
    drawRectShape : function(){
	$('#desktop').drawZone({
	    xTmp : draw_zone.drawStartPoint.X,
	    yTmp : draw_zone.drawStartPoint.Y,
	    widthTmp : draw_zone.drawEndPoint.X,
	    heightTmp : draw_zone.drawEndPoint.Y,
	    syncTitle : draw_zone.title
	});
    }
}

function drawCoordinator() {
    if (this.i == 0 || this.i == null){
	$("#desktop").svg();
	var svg = $('#desktop').svg('get');
	
	var width = window.innerWidth;
	var height = window.innerWidth;
	var coordinator = svg.group({
            stroke: 'gray',
            strokeWidth: 1
	});
	var x = 0;
	for (i = 0; i <= width / 10; i++) {
            svg.line(coordinator, x, 0, x, height);
            x += 10;
	}
	var y = 0;
	for (i = 0; i <= height / 10; i++) {
            svg.line(coordinator, 0, y, width, y);
            y += 10;
	}
	this.i = 1;
    }
    else{
	
    }
}

