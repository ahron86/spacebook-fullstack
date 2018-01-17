var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/spacebookDB', function () {
  console.log("DB connection established!!!");
})

var Post = require('./models/postModel');

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


// You will need to create 5 server routes
// These will pdefine your API:

// 1) to handle getting all posts and their comments
app.get('/posts', function (req, res) {
  Post.find(function (err, posts) {
    if (err) throw err
    res.send(posts);
  })
});
// 2) to handle adding a post
app.post('/posts', function (req, res) {
  var newPost = req.body.text;
  var post = new Post({
    text: newPost,
    comments: []
  })
  post.save();
  res.send(post);
});

// 3) to handle deleting a post
app.delete('/posts/:id', function (req, res) {
  Post.findByIdAndRemove(req.params.id, function (err, deleted) {
    if (err) throw err;

    console.log('Successfully deleted!');
    res.send(deleted);
  })

})
// 4) to handle adding a comment to a post
app.post('/posts/:id/comments', function (req, res) {

  var comment = {
    username: req.body.username,
    text: req.body.text
  }

  //find the right post 
  //and then push the new comment to it's comment array
  Post.findByIdAndUpdate(
    req.params.id, {
      comments: comment
    },
    function (err, comment) {
      if (err) throw err;

      res.send(comment);
    })
})
// 5) to handle deleting a comment from a post



app.listen(8000, function () {
  console.log("what do you want from me! get me on 8000 ;-)");
});