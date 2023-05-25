var express = require("express");
var router = express.Router();

const isAuthenticated = require("../middleware/isAuthenticated");

const Post = require("../models/Post");

router.get("/", (req, res, next) => {
  Post.find()
    .populate("author comments")
    .sort({createdAt: "desc"})
    .then((foundPost) => {
      console.log("found post", foundPost);
      res.json(foundPost);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/create", isAuthenticated, (req, res, next) => {
  const { post, image, type } = req.body;

  console.log("image:", image);

  Post.create({
    post,
    image,
    type,
    author: req.user._id,
  })
    .then((createdPost) => {
      console.log("req body:", req.body);
      res.json(createdPost);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/detail/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .populate("author")
    .populate({ path: "comments", populate: { path: "author" } })
    .populate("likes")
    .then((foundPost) => {
      res.json(foundPost);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/delete/:id", (req, res, next) => {
  Post.findByIdAndDelete(req.params.id)
    .then((deletedPost) => {
      res.json(deletedPost);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/edit/:id", (req, res, next) => {
  const { id } = req.params;
  const { post, image, type } = req.body;

  Post.findByIdAndUpdate(
    id,
    {
      post,
      image,
      type,
    },
    { new: true }
  )
    .then((updatedPost) => {
      res.json(updatedPost);
    })
    .catch((err) => {
      console.log(err);
    });
});

// then((foundPost) => if foundPost.likes.includes(req.user._id)

router.post("/like", isAuthenticated, (req, res, next) => {
    // Post.findById(req.body.postId).then((foundPost) => {
    //     if (foundPost.likes.includes(req.user._id))
    //       res.status(400).json({ message: "Not authorized" });
    //     return;
    //   });
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .then((response) => res.json(response))
    .catch((err) => {
      console.log(err);
    });
});

router.post("/unlike", isAuthenticated, (req, res, next) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .then((response) => res.json(response))
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
