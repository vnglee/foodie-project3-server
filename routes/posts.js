var express = require('express');
var router = express.Router();

const isAuthenticated = require('../middleware/isAuthenticated')

const Post = require('../models/Post')

router.get('/', (req, res, next) => {
    Post.find()
        .populate('author comments')
        .sort({updatedAt: "desc"})
        .then((foundPost) => {
            console.log('found post', foundPost)
            res.json(foundPost)
        })
        .catch((err) => {
            console.log(err)
        })
})

router.post('/create', isAuthenticated, (req, res, next) => {

    const {post, image, type} = req.body

    console.log('image:', image)

    Post.create({
        post,
        image,
        type,
        author: req.user._id
    })
    .then((createdPost) => {
        console.log('req body:', req.body)
        res.json(createdPost)
    })
    .catch((err) => {
        console.log(err)
    })
})

router.get('/detail/:id', (req, res, next)=> {
    Post.findById(req.params.id)
    .populate('author')
    .populate({path: 'comments', populate: {path: 'author'}})
    .populate('likes')
    .then((foundPost) => {
        res.json(foundPost)
    })
    .catch((err) => {
        console.log(err)
    })
})

router.delete('/delete/:id', (req, res, next) => {
    Post.findByIdAndDelete(req.params.id)
    .then((deletedPost) => {
        res.json(deletedPost)
    })
    .catch((err) => {
        console.log(err)
    })
})

router.post('/edit/:id', (req, res, next) => {

    const {id} = req.params;
    const {post, image, type} = req.body

    Post.findByIdAndUpdate(id, 
        {
            post,
            image,
            type
        }, 
            {new:true}
        )
    .then((updatedPost) => {
        res.json(updatedPost)
    })
    .catch((err) => {
        console.log(err)
    })
})



module.exports = router;
