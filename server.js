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
  
      $("div.title-info").each(function (i, element) {
        const results = {};

        // Save the text of the element in a "title" variable
        // const title = $(element).text();
  
        // In the currently selected element, look at its child elements (i.e., its a-tags),
        // then save the values for any "href" attributes that the child elements may have
        // const link = $(element).find("h1").find("a").attr("href");
  
        // Save these results in an object that we'll push into the results array we defined earlier
        // results.push({
        //   title: title,
        //   link: link
        // });

        result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

        db.Article.create(results)
        .then((dbArticle) => {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch((err) => {
          // If an error occurred, log it
          console.log(err);
        });
      });
      res.send("Scrape Complete");

      // Log the results once you've looped through each of the elements found with cheerio
    //   console.log(results);
    });
  });
  app.get("/articles", (req, res) => {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
      .then(function (allArticles) {
        res.json(allArticles);
      })
      .catch(function (err) {
        res.json(err);
      })
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", (req, res) => {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
    db.Article.findOne({
      _id: req.params.id
    })
      .populate("note")
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err)
      });
  
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", (req, res) => {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
    db.Note.create(req.body)
  
      .then(function (dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote } }, { new: true });
      }).then(function (newNote) {
        // If the User was updated successfully, send it back to the client
        res.json(newNote);
      })
      .catch(function (err) {
        res.json(err)
      });
  });
  
  // Start the server
  app.listen(PORT, () => {
    console.log("App running on port " + PORT + "!");
  });
  