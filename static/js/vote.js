

function cancel_vote(){
    $('#wrong-vote').show("fold",  {size: 2}, 500).delay(1500).hide("fold",  {size: 2}, 500);
}

var vote = {
    up : function(id){
	id = typeof(id) != 'undefined' ? id : -1;
	if (id == -1){
	    alert('undefined');
	    return 0;
	}
	var vote_div = $('#vote-nb' + id);
	var vote_to_set = eval(vote_div.html()) + 1;
	vote_div.html(vote_to_set);
	$.ajax({
	    type : "POST",
	    url : ajax_urls.votes.up_vote,
	    data : "id=" + id,
	    success : function(data){
		if (jQuery.parseJSON(data).success == "false"){
		    vote_div.html(vote_to_set - 1);
		    notify('You already voted !');
		    //cancel_vote();
		}
	    },
	    error : function(){
		alert('error already votes or error');
	    }
	})
    },
    down : function(id){
	id = typeof(id) != 'undefined' ? id : -1;
	if (id == -1){
	    alert('undefined');
	    return 0;
	}
	var vote_div = $('#vote-nb' + id);
	var vote_to_set = eval(vote_div.html()) - 1;
	vote_div.html(vote_to_set);
	$.ajax({
	    type : "POST",
	    url : ajax_urls.votes.down_vote,
	    data : "id=" + id,
	    success : function(data){
		if (jQuery.parseJSON(data).success == "false"){
		    vote_div.html(vote_to_set + 1);
		    notify('You already voted !');
		    //cancel_vote();
		}
	    },
	    error : function(){
		alert('error already votes or error');
	    }
	})
    }
}