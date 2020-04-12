let middleware = {};
let Campground = require('../models/campgrounds');
let Comment = require('../models/comments');

//check if user is logged in
middleware.loginRequired = (req, res, next) => {
    if(!req.user){
        req.flash('error', 'Please login to proceed');
        return res.redirect('/login');
    }
    next();
}

//Check if user is authorized for campgrounds
middleware.isOwner = (req, res, next) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(req.user && campground.author.id.equals(req.user._id)){
            next();
        }else{
            req.flash('error', 'Sorry, user did not match!!');
            res.redirect('back');
        }
    });
}

//Check user authorization for comments
 middleware.isOwner = (req, res, next) => {
    Comment.findById(req.params.commentId, (err, comment) => {
        if(req.user && comment.author.id.equals(req.user._id)){
            next();
        }else{
            req.flash('error', 'Sorry, user did not match!!');
            res.redirect('back');
        }
    });
}

module.exports = middleware;