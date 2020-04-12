let express = require('express');
let router = express.Router();
let Campground = require('../models/campgrounds.js');
let middleware = require('../middleware');


//Campgrounds page

router.get('/campgrounds', (req,res) => {
    console.log(req.session);
    Campground.find({}, (err, campground) => {
        if(err){
            console.log("Error in fetching gallery");
        }else{
            res.render('campground/campgrounds', {campground: campground});
        }
    });
})

//Create new campground
router.get('/campgrounds/new', (req, res) => {
    res.render('campground/new');
})

router.post('/campgrounds', middleware.loginRequired, (req,res) => {

    Campground.create(req.body, (err, newCamp) => {
        if(err){
            req.flash('error', 'Error: ' + err);
            res.send('/campgrounds');
        }else{
            newCamp.author.username = req.user.username;
            newCamp.author.id = req.user._id;
            newCamp.save();
            req.flash('success', 'Campground added');
            res.redirect('/campgrounds');
        }
    })
})

//Show specific campground information
router.get('/campgrounds/:id', middleware.loginRequired, (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
        if(err){
            req.flash('error', 'Campground not found');
            res.redirect('/campgrounds');
        }
        res.render("campground/show", {campground: campground});
    }) 
})

//Edit existing campground on show page
router.get('/campgrounds/:id/edit', middleware.isOwner, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        
        res.render("campground/edit", {campground: campground}); 
    });
})

router.put('/campgrounds/:id', (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
        if(err){
            req.flash('error', 'Error: ' + err);
            res.redirect('/campgrounds/' + req.params.id);
        }
        req.flash('success', 'Campground updated');
        res.redirect("/campgrounds/" + req.params.id);
    });
});

//Delete campground
router.delete('/campgrounds/:id', middleware.isOwner, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, result) => {
        if(err){
            req.flash('error', 'Error deleting campground: ' + err);
            res.redirect('/campgrounds/' + req.params.id);
        }else if(result){
            req.flash('success', 'Campground deleted');
            res.redirect('/campgrounds');
        }
    });
});


module.exports = router;