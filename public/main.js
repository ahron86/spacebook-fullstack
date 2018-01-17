var SpacebookApp = function () {

  var posts = [];

  var $posts = $(".posts");

  var fetch = function (data) {
    $.ajax({
      method: "GET",
      url: "/posts",
      success: function (data) {
        posts = data;
        _renderPosts();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  function _renderPosts() {
    $posts.empty();
    var source = $('#post-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts.length; i++) {
      var newHTML = template(posts[i]);
      console.log(newHTML);
      $posts.append(newHTML);
      _renderComments(i)
    }
  }

  function addPost(newPost) {
    $.ajax({
      method: "POST",
      url: "/posts",
      data: {
        text: newPost
      },
      success: function (data) {
        console.log(data)

        posts.push({
          id: data._id,
          text: newPost,
          comments: []
        });

        _renderPosts();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }


  function _renderComments(postIndex) {
    var post = $(".post")[postIndex];
    $commentsList = $(post).find('.comments-list')
    $commentsList.empty();
    var source = $('#comment-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts[postIndex].comments.length; i++) {
      var newHTML = template(posts[postIndex].comments[i]);
      $commentsList.append(newHTML);
    }
  }

  var removePost = function (id) {
    $.ajax({
      type: "DELETE",
      url: "/posts/" + id,
      success: function (data) {
        console.log(data);
        fetch();
      }
    })
  };

  var addComment = function (id, newComment, postIndex) {
    $.ajax({
        method: "POST",
        url: "/posts/" + id + "/comments/",
        data: newComment,
        success: function (data) {
          console.log("succeeded adding comment");
          posts[postIndex].comments.push(newComment);
          _renderComments(postIndex);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }
    })
  }


  var deleteComment = function (postID, postIndex, commentID, commentIndex) {
    $.ajax({
      type: "DELETE",
      url: "/posts/" + postID + "/comments/" + commentID,
      success: function (data) {
        console.log(data);
        fetch();
      }
    })
    posts[postIndex].comments.splice(commentIndex, 1);
    _renderComments(postIndex);
  };

  return {
    addPost: addPost,
    removePost: removePost,
    addComment: addComment,
    deleteComment: deleteComment,
    fetch: fetch
  };
};

var app = SpacebookApp();
app.fetch();

$('#addpost').on('click', function () {
  var $input = $("#postText");
  if ($input.val() === "") {
    alert("Please enter text!");
  } else {
    app.addPost($input.val());
    $input.val("");
  }
});

var $posts = $(".posts");

$posts.on('click', '.remove-post', function () {
  var index = $(this).closest('.post').index();
  var id = $(this).closest('.post').data().id;
  app.removePost(id);
});

$posts.on('click', '.toggle-comments', function () {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('click', '.add-comment', function () {

  var $comment = $(this).siblings('.comment');
  var $user = $(this).siblings('.name');

  if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
  }
  
  var id = $(this).closest('.post').data().id

  var postIndex = $(this).closest('.post').index();
  var newComment = {
    text: $comment.val(),
    user: $user.val()
  };

  app.addComment(id, newComment, postIndex);

  $comment.val("");
  $user.val("");

});

$posts.on('click', '.remove-comment', function () {
  var $commentsList = $(this).closest('.post').find('.comments-list');
  var postIndex = $(this).closest('.post').index();
  var postID = $(this).closest('.post').data().id;
  var commentIndex = $(this).closest('.comment').index();
  var commentID =$(this).closest('.comment').data().id;

// här nedan i parantesen ska postid och commentid in när funktionen
  app.deleteComment(postID, postIndex, commentID, commentIndex);
});