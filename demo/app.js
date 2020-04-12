var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var sessions = require('client-sessions');
var methodOverride = require('method-override');
var bcrypt  = require('bcryptjs');
var flash = require('connect-flash');
var seedDb = require('./seeds.js');
var campRoutes = require('./routes/campground.js');
var commentRoutes = require('./routes/comment.js');
var authRoutes = require('./routes/auth.js');

app.use(flash());

//======Creating session of 10 mins for users=====
app.use(sessions({
    cookieName: 'session',
    secret: 'sagar',
    duration: 10*60*1000 //10 mins
}))


//Connect to Mongodb database sagar_ekhe. Creating db sagar_ekhe
mongoose.connect("mongodb://localhost/sagar_ekhe", {useNewUrlParser: true});

//Requiring db collections
const Comment = require("./models/comments.js");
const Campground = require("./models/campgrounds.js");
const User = require("./models/users.js");

//Use dependencies
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//Setting path for css
app.use(express.static(__dirname + '/public'));

//seedDb();

//Middleware and adding logged in user to acces from any template
app.use((req, res, next) => {

    res.locals.user = null;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    
    if(!req.session && !req.session.userId){
        return next();
    }

    User.findById(req.session.userId, (err, user) => {
        if(err){
            return next(err);
        }

        if(!user){
            return next();
        }

        req.user = user;
        res.locals.user = user;
        
        next();
    });
});


//Landing page
app.get('/', (req, res) => {
    res.render('home');
});

//Connect authentication routes
app.use(authRoutes);

//Connect campground routes
app.use(campRoutes);

//Connect comment routes
app.use(commentRoutes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});