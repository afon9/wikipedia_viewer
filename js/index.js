var searchFor = "none";

$("#WikiSearch1").on("click", function () {
  searchFor = document.getElementById("inputId1");
});
$("#WikiSearch2").on("click", function () {
  searchFor = document.getElementById("inputId2");
});

$("#WikiSearch1, #WikiSearch2").on("click", function () {
  console.log(searchFor.value);
  if (searchFor.value !== "") {
    ajaxWiki(searchFor.value.replace(/ /g,"_"));
  $('#results').html($('#static').html()).show().siblings('div').hide();
  } else {
    alert("Enter a keyword into the search box");
  } 
})

function ajaxWiki (keyword) {
    $.ajax({ 
      url: "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + keyword + "&prop=info&inprop=url&utf8=&format=json",
     dataType: "jsonp",
     success: function(data) {
       console.log(data.query);
       if (data.query.searchinfo.totalhits === 0) {
         showError(keyword);
       }
       else {
         showResults(data);
       }
    },
    error: function () {
      alert("Error retrieving search results, please refresh the page");
      }
    });    
}

function showResults (data) {
  $("#search_results").html("");
  for (var i = 0; i <= 9; i++) {
		$("#search_results").append("<div class='result-list result-" + i + "'>" + "<span class='result-title title-" + i + "'></span>" + "<br>" +"<span class='result-snippet snippet-" + i + "'></span>" + "<br>" + "<span class='result-metadata text-muted metadata-" + i + "'></span>" + "</div>" );
	}

	for (var m = 0; m <= 9; m++) {
		var title = data.query.search[m].title;
		var url = title.replace(/ /g, "_");
		var timestamp = data.query.search[m].timestamp;
		timestamp = new Date(timestamp);
		console.log(timestamp);
		$(".title-" + m).html("<a href='https://en.wikipedia.org/wiki/" + url + "' target='_blank'>" + data.query.search[m].title + "</a>");
		$(".snippet-" + m).html(data.query.search[m].snippet);
		$(".metadata-" + m).html((data.query.search[m].size/1000).toFixed(0) + "kb (" + data.query.search[m].wordcount + " words) - " + timestamp);
	}
}

function showError(keyword) {
	$("#search_results").html( "<div class='error'> <p>Your search <span class='keyword'><b>" + keyword + "</b></span> did not match any documents.</p> <p>Suggestions:</p><li>Make sure that all words are spelled correctly.</li><li>Try different keywords.</li><li>Try more general keywords.</li></div> ");
}