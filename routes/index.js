const express = require("express");
const router  = express.Router();
const passport = require("passport");
const User = require("../models/user");

/* GET Homepage */
router.get('/', function(req, res) {
  res.render('home');
});


/*

	BELOW IS ALL AUTHENTICATION ROUTES
	1. HIDDEN PAGE
	2. REGISTER
	3. LOGIN
	4. SIGN OUT

*/


// THIS WILL BE BEHIND A LOGIN - isLoggedIn is our middleware
router.get('/secret', isLoggedIn, function(req, res) {
	res.render('secret');
});


// REGISTER PAGE
router.get('/register', function(req, res) {
	res.render('register');
});

// POST REGISTER HANDLING
router.post('/register', function(req, res) {

	// password is added outside the new user as User.register will hash the password
	User.register(new User({username: req.body.username}), req.body.password, function(err, user)  {
		if (err) {
			console.log('something went wrong register ' + err);
			res.render('register');
		}

		// no error - user created - log the user in - take care of the session, run the serialize method above
		// 'local' stratergy is the user logging in direct to the website not facebook, so local
		passport.authenticate('local')(req, res, function() {
			res.redirect('/secret');
		})
	})
});

// LOGIN PAGE
router.get('/login', function(req, res) {
	res.render('login');
});

// LOGIN HANDLING VIA POST REQUEST
// inside the app.post not the callback - this is called middleware (ran instantly) 
// sit between the beginning of the route and the call back - hence middleware

// compare hashed input with the one in the database
router.post('/login', passport.authenticate('local',  {
	successRedirect: '/secret',
	failureRedirect: '/login'
}), function(req, res) {
});


// LOGOUT REQUEST - logout comes from passport
router.get('/logout', function(req, res) {
	// destroy the session
	req.logout();
	res.redirect('/');
})

/*// ALL OTHER ROUTES - ERROR PAGE SHOWN FOR NOW
router.get('*', function(req, res) {
	res.render('error');
});*/


/*

	MIDDLEWARE - THREE PARAMS
	1. REQUEST
	2. RESPONE
	3. NEXT FUNCTION

*/


// middleware function to check user is logged in
// request, response and next, move onto callback in the function where this is used
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
};

module.exports = router;