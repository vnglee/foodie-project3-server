var express = require('express');
var router = express.Router();

const Comment = require('../models/Comment')
const Post = require('../models/Post')
const isAuthenticated = require("../middleware/isAuthenticated");

router.post('/add-comment/:id', isAuthenticated, (req, res, next) => {

    // const {author, comment} = req.body

    Comment.create({
        author: req.user._id, 
        comment: req.body.comment
    })
    .then((newComment) => {

        console.log('new comment', newComment)
        console.log("this is params:", req.params.id)
        

        return Post.findByIdAndUpdate(req.params.id, 
            {
                $push: {comments: newComment._id}
            },
            {
                new: true
            })
    })
    .then(response => res.json(response))
    .catch((err) => {
        console.log(err)
    })
})

module.exports = router;
