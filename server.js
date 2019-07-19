const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars"),


// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

const PORT = process.env.PORT || 8080;

// Initialize Express
const app = express();

app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/scrape", (req, res) => {

    // Make a request via axios to grab the HTML body from the site of your choice
    axios.get("https://www.slashfilm.com").then((response) => {
  
      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      const $ = cheerio.load(response.data);
  
      // An empty array to save the data that we'll scrape
      const results = [];
  
      $("div.title-info").each(function (i, element) {
  
        // Save the text of the element in a "title" variable
        const title = $(element).text();
  
        // In the currently selected element, look at its child elements (i.e., its a-tags),
        // then save the values for any "href" attributes that the child elements may have
        const link = $(element).find("h1").find("a").attr("href");
  
        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
          title: title,
          link: link
        });
  
      });
  
      // Log the results once you've looped through each of the elements found with cheerio
      console.log(results);
    });
  });
  