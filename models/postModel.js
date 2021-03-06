var mongoose = require('mongoose');

//design the two schema below and use sub docs 
//to define the relationship between posts and comments

var commentSchema = new mongoose.Schema({
    text: String,
    username: String,
})

var postSchema = new mongoose.Schema({
    text: String,
    username: String,
    comments: [commentSchema]
})

var Post = mongoose.model('post', postSchema)

module.exports = Post