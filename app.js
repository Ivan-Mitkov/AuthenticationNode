const express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    User = require('./models/user.js'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose');



const app = express();

let port = process.env.port || 3000;
mongoose.connect('mongodb://localhost/demo_auth', { useNewUrlParser: true });

app.use(require('express-session')({
    //secret is used to encode and decode sessions
    secret: "Something which is secret",
    resave: false,
    saveUninitialized: false

}));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// the credentials used to authenticate a user will only be transmitted during
// the login request. If authentication succeeds, a session will be established and maintained 
//via a cookie set in the user's browser.
// Each subsequent request will not contain credentials, 
//but rather the unique cookie that identifies the session. 
//In order to support login sessions, Passport will serialize and deserialize user instances
// to and from the session.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//auth login 
passport.use(new LocalStrategy(User.authenticate()));

//============
//ROUTES

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/secret', isLoggedIn, (req, res) => {
    res.render('secret');
});

//Auth routes
//register routes
app.get('/register', (req, res) => {
    res.render('register');
})
app.post('/register', (req, res) => {
    User.register(new User({ username: req.body.username }),
        req.body.password,
        (err, user) => {
            if (err) {
                console.log(err);
                return res.redirect('/register');
            }
            passport.authenticate('local')(req, res, () => {
                res.redirect('/secret');
            })
        });
});

//login routes
app.get('/login', (req, res) => {
    res.render('login');
});

//middleware
app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
}), (req, res) => {
});

//logout routes
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
    //still can go to /secret
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


app.listen(port, process.env.IP, () => {
    console.log(`App listen to the port ${port} at IP: ${process.env.IP}`);
})

