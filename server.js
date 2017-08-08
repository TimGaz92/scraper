
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
 app.use(logger("dev"));
 app.use(express.static(__dirname + '/public'));

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
  // res.sendFile(path.join(__dirname, "public/find.html"));
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
  // res.sendFile(path.join(__dirname, "public/findw.html"));
  // res.send("scraping https://worldarchery.org/news")
  request("http://www.teamusa.org/usa-archery/news/features", function(error, response, html) {
      var $ = cheerio.load(html);
      var results = [];
      $("div.col-xs-12").each(function(i, element) {
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
//reddit olympic archery route 
app.get("/findolympicred", function(req, res) {
  // res.sendFile(path.join(__dirname, "public/findo.html"));
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
   // res.sendFile(path.join(__dirname, "public/results.html"));
	  db.scrapedData.find({}, function(error, found) {
    if (error) {
      console.log(error);
    }
    else {
      console.log(found);
      res.json(found); //change this from a res.json to a regular db write to page - repete for all
    }
  });		
});
//change the html pages to handlebars and use res.send
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//olympic archery reddit  results
app.get("/resultso", function(req, res){
  // res.sendFile(path.join(__dirname, "public/resultso.html"));
    db.scrapedDataOlympicRed.find({}, function(error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });   
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//world archery results route 
app.get("/resultsworld", function(req, res){
    // res.sendFile(path.join(__dirname, "public/resultsw.html"));
    db.scrapedDataWorld.find({}, function(error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });   
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});

