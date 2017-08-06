console.log("team USA logic loaded");



//call to db
function getResults(){
	$.getJSON("/results", function(found) {
    for (var i = 0; i < found.length; i++) {
      $("#resultsDiv").prepend(found[i].title + "<br>"+ found[i].link);
      console.log("data" + found.title);
    }
  });
}
getResults();