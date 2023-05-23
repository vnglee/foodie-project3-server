var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken')

const User = require('../models/User')
const Post = require('../models/Post')

router.get('/profile/:id', (req, res, next) => {
    User.findById(req.params.id)
    .then((foundUser) => {
        Post.find({author: foundUser._id})
            .populate("author likes")
            .populate({path: "comments", populate: {path: "author"}})
            .then((foundPosts) => {
                res.json({user: foundUser, posts: foundPosts})
            })
            .catch((err) => {
                console.log(err)
            })
    })
    .catch((err) => {
        console.log(err)    
    })
})

router.post('/update/:id', (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, req.body, {new:true})
    .then((updatedUser) => {

        const {_id, email, name, profilePic} = updatedUser

        const payload = {_id, email, name, profilePic}

        const authToken = jwt.sign( 
            payload,
            process.env.SECRET,
            { algorithm: 'HS256', expiresIn: "6h" }
          );
    
              res.status(200).json({ authToken: authToken, user: payload });
        })
    .catch((err) => {
        console.log(err)
    })
})

module.exports = router;
