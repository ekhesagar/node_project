let express = require('express');
let router = express.Router();
let Campground = require('../models/campgrounds.js');
let Comment = require('../models/comments.js');
let middleware = require('../middleware');

//Add new comment
router.get('/campgrounds/:id/comments/new', middleware.loginRequired, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        res.render('comment/new', {campground: campground});
    })
})

router.post("/campgrounds/:id/comments", middleware.loginRequired, (req, res) => {
    
    let comment = {text: req.body.text};

    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            req.flash('error', 'Please try again');
            res.redirect('/campgrounds/' + req.params.id);
        }else{
            Comment.create(comment, (err, comment) => {
                if(err){
                    req.flash('error', 'Please try again');
                    res.redirect('/campgrounds/' + req.params.id);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'Comment added');
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
    
});

//Edit comment
router.get('/campgrounds/:id/comments/:commentId/edit', middleware.isOwner, (req, res)=>{
    let campground_id = req.params.id;
    Comment.findById(req.params.commentId, (err, comment)=>{
        if(err){
            req.flash('error', 'Error occured in finding comment to edit');
            res.redirect('/campgrounds/' + req.params.id);
        }else{
            res.render('comment/edit', {campground_id: campground_id, comment: comment});
        }
    });
});

router.put('/campgrounds/:id/comments/:commentId', middleware.loginRequired, middleware.isOwner, (req, res)=>{
    Comment.findById(req.params.commentId, (err, comment)=>{
        if(err){
            req.flash('error', 'Failed to edit comment');
            res.redirect('/campgrounds/' + req.params.id);
        }else{
            comment.text = req.body.text;
            comment.save();
            req.flash('success', 'Comment was changed');
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
})


//Delete comment
router.delete('/campgrounds/:id/comments/:commentId', middleware.isOwner, (req, res)=>{
    Comment.findByIdAndRemove(req.params.commentId, (err, comment)=>{
        if(err){
            req.flash('error', 'Failed to delete comment');
            res.redirect('/campgrounds/' + req.params.id);
        }else{
            req.flash('success', 'Comment was deleted');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});


module.exports = router;
