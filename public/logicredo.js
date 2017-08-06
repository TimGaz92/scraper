console.log("reddit/OlympicArchery logic loaded");



//call to db
function getResults(){
$.ajax({
       type: "GET",
        url: "http://localhost:3000/results",
         contentType: "application/json; charset=utf-8",
           dataType: "json",                        
            success: function (response) {
              console.log("success");
            },
            error: function (response){
             console.log("failed");
            }
            });
}
getResults();