
// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var path = require("path");
var request = require("request");
var cheerio = require("cheerio");
var logger = require("morgan");
var mongoose = require("mongoose");
mongoose.Promise = Promise;

var app = express();

var databaseUrl = "scraper";
var collections = ["scrapedData"];

var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route 
app.get("/", function(req, res) {
  	res.sendFile(path.join(__dirname, "public/index.html"));
});

//this is the finder route for the archery sub-reddit
app.get("/findred", function(req, res) {
  res.sendFile(path.join(__dirname, "public/find.html"));
	// res.send("scraping https://www.reddit.com/r/archery")
	request("https://www.reddit.com/r/archery", function(error, response, html) {
  		var $ = cheerio.load(html);
  		var results = [];
  		$("p.title").each(function(i, element) {
    	var title = $(element).text();
    	var link = $(element).children().attr("href");
    		results.push({
      		title: title,
      		link: link
    		});
  		});
  	console.log(results);
    console.log("test log----------------------------------------------------");
  	db.scrapedData.insert(results)
	});
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//route to find the world archery news page 
app.get("/findworld", function(req, res) {
  // res.sendFile(path.join(__dirname, "public/find.html"));
  res.send("scraping https://worldarchery.org/news")
  request("https://worldarchery.org/news", function(error, response, html) {
      var $ = cheerio.load(html);
      var results = [];
      $("p.title").each(function(i, element) {
      var title = $(element).text();
      var link = $(element).children().attr("href");
        results.push({
          title: title,
          link: link
        });
      });
    console.log(results);
    db.scrapedDataWorld.insert(results)
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//extra route to find another site - don't knpo what yet
app.get("/findolympicred", function(req, res) {
  res.sendFile(path.join(__dirname, "public/findo.html"));
  // res.send("scraping https://www.reddit.com/r/archery")
  request("https://www.reddit.com/r/olympicarchery/", function(error, response, html) {
      var $ = cheerio.load(html);
      var results = [];
      $("p.title").each(function(i, element) {
      var title = $(element).text();
      var link = $(element).children().attr("href");
        results.push({
          title: title,
          link: link
        });
      });
    console.log(results);
    console.log("test log----------------------------------------------------");
    db.scrapedDataOlympicRed.insert(results)
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//route to display the results  - reddit archery
app.get("/results", function(req, res){
	  db.scrapedData.find({}, function(error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });		
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//olympic archery reddit  results
app.get("/resultso", function(req, res){
    db.scrapedDataOlympicRed.find({}, function(error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });   
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//world archery results route 
app.get("/resultsworld", function(req, res){
    db.scrapedDataWorld.find({}, function(error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });   
})





// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});


//        THIS IS FORM 8/5 CLASS, USE AS TEMPLATE 

// // Dependencies
// var express = require("express");
// var bodyParser = require("body-parser");
// var logger = require("morgan");
// var mongojs = require("mongojs");

// // Initialize Express
// var app = express();

// // Configure our app for morgan and body parser
// app.use(logger("dev"));
// app.use(bodyParser.urlencoded({
//   extended: false
// }));

// // Static file support with public folder
// app.use(express.static("public"));

// // Mongojs configuration
// var databaseUrl = "week18day3";
// var collections = ["books"];

// // Hook our mongojs config to the db var
// var db = mongojs(databaseUrl, collections);
// db.on("error", function(error) {
//   console.log("Database Error:", error);
// });


// // Routes
// // ======


// // TODO: Fill in each route so that the server performs
// // the proper mongojs functions for the site to function
// // -/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/


// // Post a book to the mongoose database
// app.post("/submit", function(req, res) {
//   var book = req.body;
//     book.read = false;
//       db.books.save(book, function(err, data){
//         if (!err) {
//           res.send(data);
//         }
//         else{
//           res.send("error with DB" + book.title);
//         }
//       });
// });


// // Find all books marked as read
// app.get("/read", function(req, res) {
//   db.books.find({ read: true }, function(err, data){
//       if (err) {
//       console.log(err);
//       }
//     else{
//     res.send(data);
//     }
//   });  
// });


// // Find all books marked as unread
// app.get("/unread", function(req, res) {
//     db.books.find({ read: false }, function(err, data){
//       if (err) {
//       console.log(err);
//       }
//     else{
//     res.send(data);
//     }
//   });   
// });



// // Mark a book as having been read
// app.get("/markread/:id", function(req, res) {
//   db.books.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {read: true}}, function(err, data){
//     if (! err) {
//       res.json(data);
//     }
//     else{
//       console.log(err);
//     }
//   });
// });


// // Mark a book as having been not read
// app.get("/markunread/:id", function(req, res) {
//   db.books.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {read: false}}, function(err, data){
//     if (! err) {
//       res.json(data);
//     }
//     else{
//       console.log(err);
//     }
//   });
// });

// // Listen on port 3000
// app.listen(3000, function() {
//   console.log("App running on port 3000!");
// });
