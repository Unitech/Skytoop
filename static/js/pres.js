
function main(){


    operation_pending = {
	start : function(){
	    this.id = $('#logo');
	    this.id.fadeOut(2200).fadeIn(2200);
	    this.break_wallpaper = setInterval(function() {
	        $('#logo').fadeOut(2200).fadeIn(2200);
	    }, 4400);
	},
	finish : function(){
	    clearInterval(this.break_wallpaper);
	    this.id.fadeIn('fast');
	}
    };

    jQuery(document).ready(function() {


	var wisc = $('.wis-sub-content');
	var v; 
	var time_disp;

	$('#wis-content, .wis-sub-content').mouseleave(function(){
	    v = setTimeout(function(){
		$('.wis-sub-content').fadeOut('slow', function(){
		$('.book-gold').animate({'width':'219px'});
		    $('.wis-sub-content').removeAttr('display');
		});
		okdone = false;
	    }, 650);
	});
	
	$('#wis-content, .wis-sub-content').mouseover(function(){
	    clearInterval(v);
	});


	var d, glok = false;

	$('#wis-content').mouseenter(function(){
	    d = setTimeout(function(){
		if ($('.wis-sub-content').attr('display') == null) {
		    $('.wis-sub-content').attr({'display':'show'});
		    $('.book-gold').animate({'width':'0px'}, 200, function(){
			$('.wis-sub-content')
			    .css({'width':650})
			    .fadeIn('fast');
		    });
		    okdone = true;
		}
	    }, 650);
	});

	var g, okdone = false;

	$('#wis-content').find('li').each(function(i){
	    var self = $(this);

	    $(this)
		.mouseover(function(){
		    
		    var content = $('.wis-sub-' + i).html();
		    wisc.html(content);


		    if (okdone == false){
			g = setTimeout(function(){
			    self.css({
				'background-color' : '#444',
				'width' : '500px',
				'opacity' : 1,
				'border-radius' : '5px',
				'-moz-border-radius' : '10px'
			    });
			    self.animate({
				'width' : window.innerWidth - 500,
			    });
			    glok = true;
			},650);
		    }
		    else{
			self.css({
			    'background-color' : '#444',
			    'width' : '500px',
			    'opacity' : 1,
			    'border-radius' : '5px',
			    '-moz-border-radius' : '10px'
			});
			self.animate({
			    'width' : window.innerWidth - 500,
			});
		    }

		    
		})
		.mouseout(function(){
		    clearInterval(g);
		    self.css({
			'background-color' : '',
			'opacity': ''
		    });
		   
		});
	    
	    
	});
	    
	$('#wis-content').mouseleave(function(){
	    clearInterval(d);
	});
	/*
	var searchBar = function(){
	    var search = $('#name');
	    
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
		ajax("{{=URL('public', 'person_speed_search')}}", ['name'], 'suggestions')
	    });

	    // prevent refresh page if form submited (/!\)
	    search.parent().parent().find('#search-pub-form').submit(function(e){	    
		e.preventDefault();
	    });
	}
	*/
	//searchBar();
	operation_pending.start();
    });
    

}