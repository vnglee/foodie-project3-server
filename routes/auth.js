var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const saltRounds = 10

const isAuthenticated = require('../middleware/isAuthenticated')

// POST  /auth/signup

router.post('/signup', (req, res, next) => {
  const { email, password, name } = req.body;
 

  if (email === '' || password === '' || name === '') {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }
    
  User.findOne({ email })
    .then((foundUser) => {

      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }
 
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
  
      User.create({ email, password: hashedPassword, name })
        .then((createdUser) => {

          const { email, _id, profilePic, name } = createdUser;
        
          const payload = { email, _id, profilePic, name };
    
          const authToken = jwt.sign( 
              payload,
              process.env.SECRET,
              { algorithm: 'HS256', expiresIn: "6h" }
            );
    
          console.log("Signup", payload)
    
          res.status(201).json( { authToken: authToken, user: payload });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ message: "Signup error." })
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" })
    });
});





// router.post('/signup', (req, res, next) => {
//     const { email, password, name } = req.body;
   

//     if (email === '' || password === '' || name === '') {
//       res.status(400).json({ message: "Provide email, password and name" });
//       return;
//     }
      
//     User.findOne({ email })
//       .then((foundUser) => {

//         if (foundUser) {
//           res.status(400).json({ message: "User already exists." });
//           return;
//         }
   
//         const salt = bcrypt.genSaltSync(saltRounds);
//         const hashedPassword = bcrypt.hashSync(password, salt);
    
//         return User.create({ email, password: hashedPassword, name });
//       })
//       .then((createdUser) => {
 
//         const { email, _id, profilePic, name } = createdUser;
      
//         const payload = { email, _id, profilePic, name };
   
//         const authToken = jwt.sign( 
//             payload,
//             process.env.SECRET,
//             { algorithm: 'HS256', expiresIn: "6h" }
//           );

//         console.log("Signup", payload)
   
//         res.status(201).json( { authToken: authToken, user: payload });
//       })
//       .catch(err => {
//         console.log(err);
//         res.status(500).json({ message: "Internal Server Error" })
//       });
//   });
   

// POST  /auth/login
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
   

    if (email === '' || password === '') {
      res.status(400).json({ message: "Provide email and password." });
      return;
    }
   

    User.findOne({ email })
      .then((foundUser) => {
      
        if (!foundUser) {
 
          res.status(401).json({ message: "User not found." })
          return;
        }

        const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
   
        if (passwordCorrect) {

          const { _id, email, name, profilePic, userName} = foundUser;
          
          const payload = { _id, email, name, profilePic};
   
   
          const authToken = jwt.sign( 
            payload,
            process.env.SECRET,
            { algorithm: 'HS256', expiresIn: "6h" }
          );
          res.status(200).json({ authToken: authToken, user: payload });
        }
        else {
          res.status(401).json({ message: "Unable to authenticate the user" });
        }
   
      })
      .catch(err => res.status(500).json({ message: "Internal Server Error" }));
  });

// GET  /auth/verify
router.get('/verify', isAuthenticated, (req, res, next) => {      
 
    console.log("req.user", req.user);
    res.status(200).json(req.user);
  });


module.exports = router;
