//jshint esversion:6

require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const truncate = require("truncate-html");
const mongoose = require("mongoose");

mongoose.connect(process.env.DBURL, { useNewUrlParser: true, useUnifiedTopology: true});

const blogSchema = new mongoose.Schema({
  title: String,
  content: String
});

const BlogContent = mongoose.model("BlogContent", blogSchema);

let newBlogContent1 = new BlogContent({
  title: "Day 1",
  content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
});

let newBlogContent2 = new BlogContent({
  title: "Day 2",
  content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
});

let newBlogContent3 = new BlogContent({
  title: "Day 3",
  content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
});

let content = [newBlogContent1, newBlogContent2, newBlogContent3];

// BlogContent.insertMany(content, function(err){
//   if (err){
//     console.log(err);
//   }else{
//     console.log("Added successfully");
//   }
// });

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res){
  BlogContent.find({}, function(err, foundBlogList){
    if (err){
      console.log(err);
    }else{
      if (foundBlogList.length === 0){
        BlogContent.insertMany(content, function(err){
          if (err){
            console.log(err);
          }else{
            console.log("Added successfully");
          }
        });
        res.render("home", {para1:homeStartingContent, posts:foundBlogList});
      }else{
        res.render("home", {para1:homeStartingContent, posts:foundBlogList});
      }
    }
  })
});

app.get("/post/:blogID", function(req, res){
  const requestBlogID = req.params.blogID;
  BlogContent.findOne({_id: requestBlogID}, function(err, foundContent){
    if(err){
      console.log(err);
    }else {
      res.render("post", {postHead:foundContent.title, postBody:foundContent.content});
    }
  });
});

app.get("/about", function(req, res){
  res.render("about", {para2:aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {para3:contactContent});
});


app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const postTitle = req.body.postTitle;
  const postContent = req.body.postContent;
  const newPost = new BlogContent({
    title: postTitle,
    content: postContent
  })
  newPost.save(function(err){
    if(err){
      console.log("Error encountered while trying to save document. Error is shown below");
      console.log(err);
    }else{
      res.redirect("/");
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
