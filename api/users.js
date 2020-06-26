const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// User model
const User = require('../models/User');

// @route POST api/users
// @desc  Register new user
// @access  public
router.post('/', (req, res) => {
    const { name, email, password, checkPassword} = req.body;

    if (!name || !email || !password || !checkPassword) {
        return res.status(400).json({msg: 'Please enter all fields'})
    }
    if (password != checkPassword) {
        return res.status(400).json({msg: 'Passwords are not the same.'})
    }
    // Check for existing user
    User.findOne({email})
      .then(user => {
          if (user) {
              return res.status(400).json({msg: 'User already exists'})
          }
          const newUser = new User({
              name,
              email,
              password
          })

          // Create salt & hash
          bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser.save()
                    .then(user => {
                        jwt.sign(
                            { id: user.id },
                            config.get('jwtSecret'),
                            { expiresIn: 3600 }, 
                            (err, token) => {
                                if (err) throw err;
                                res.json({
                                    token,
                                    user: {
                                        id: user.id,
                                        name: user.name,
                                        email: user.email
                                    }
                                })
                            }
                        )
                        
                    })
              })
          })
      })
})

router.get('/', (req, res) => {
    User.find({})
        .then(users => res.send(users))
        .catch(console.log('cant find ittt'))
})

router.get('/:userId', auth, (req, res) => {
    User.find({_id: req.params.userId})
        .then(user => res.send(user))
})

router.get('/getId/:name', auth, (req, res) => {
    User.find({name: req.params.name})
        .then(user => res.send(user[0]._id))
})

module.exports = router;