console.log("reddit/archery logic loaded");



//call to db

// function getResults(){
// 	$.getJSON("/results", function(found) {
//     for (var i = 0; i < found.length; i++) {
//       $("#resultsDiv").prepend(found[i].title + "<br>"+ found[i].link);
//       console.log("data" + found.title);
//     }
//   });
// }

$("#displayRes").on("click", function(){
	console.log("btn clicked");
	$.getJSON("/results", function(found) {
		console.log(found);
    for (var i = 0; i < found.length; i++) {
      $("#resultsDiv").prepend(found[i].title + "<br>"+ found[i].link);
      console.log("data" + found.title);
    	}
	});
});