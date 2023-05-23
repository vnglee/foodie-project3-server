var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken')

const User = require('../models/User')

router.get('/profile/:id', (req, res, next) => {
    User.findById(req.params.id)
    .then((foundUser) => {
        res.json(foundUser)
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
