let express = require('express');
let router = express.Router();
let User = require('../models/users.js');
var bcrypt  = require('bcryptjs');

//Sign Up
router.get('/register', (req, res) => {
    res.render('register');
})

router.post('/register', (req, res) => {
    let hash = bcrypt.hashSync(req.body.password, 14);
    req.body.password = hash;
    
    User.create(req.body, (err, user) => {
        if(err){
            req.flash('error', 'Email already taken, please try another email');
            res.redirect('/register');
        }else{
            req.flash('success', 'Welcome to dashboard ' + user.username);
            req.session.userId = user._id;
            res.redirect('/campgrounds');
        }
    });
    
});

//Login
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if(err || !user || !bcrypt.compareSync(req.body.password, user.password)){
            req.flash('error', 'Please register to do that');
            res.redirect('/register');
        }else if(user){
            req.flash('success', 'Welcome to dashboard ' + user.username);
            req.session.userId = user._id;
            res.redirect('/campgrounds');
        }
    });
})


//Logout
router.post('/logout', (req, res) => {
    req.session.userId = null;
    req.flash('success', 'Logged out successfully');
    res.redirect('/login');
})

module.exports = router ;