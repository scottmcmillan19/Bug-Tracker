const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
// User model
const User = require('../models/User');

// @route POST api/auth
// @desc  auth user
// @access  public
router.post('/', (req, res) => {
    const { email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({msg: 'Please enter all fields'})
    }

    // Check for existing user
    User.findOne({email})
      .then(user => {
          if (!user) {
              return res.status(400).json({msg: 'User does not exist'})
          }
          // Validate password
          bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (!isMatch) return res.status(400).json({msg: 'Invalid credentials'});
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

router.post("/tokenIsValid", (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) {
            return res.json(false);
        } 

        const verified = jwt.verify(token, config.get('jwtSecret'));
        if (!verified) return res.json(false);

        const user = User.findById(verified.id);
        if (!user) return res.json(false);
        
        return res.json(true);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
})

// @route GET api/auth/user
// @desc  Get user data
// @access  Private
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
      .select('-password')
      .then(user => res.json(user));
})

router.delete("/delete", auth, (req, res) => {
    try {
        const deletedUser = User.findByIdAndDelete(req.user.id);
        console.log(deletedUser._id);
    } catch(err) {
        res.status(500).json({err: err.message})
    }
})
module.exports = router;