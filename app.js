const express 			= require('express'),
	  path 				= require('path'),
	  bodyParser 		= require('body-parser'),
	  mongoose 			= require('mongoose'),
	  expressSantizer 	= require('express-sanitizer'),
	  methodoverride  	= require('method-override'),
	  passport 			= require('passport'),
	  LocalStrategy 	= require('passport-local')
	  session 			= require('express-session'),
	  User				= require('./models/user'),
	  House				= require('./models/house'),
	  passport_local 	= require('passport-local-mongoose');  

const app = express();

const forSaleRoutes = require('./routes/forsale'),
	  indexRoutes  	= require('./routes/index');

// db connection
mongoose.connect('mongodb+srv://mongo_admin:0VZuId9Oz08rBuoI@yelpcamp.5yojd.mongodb.net/agentfree?retryWrites=true&w=majority');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// secret to encode/decode
app.use(session({
	secret: 'test secret string',
	resave: false,
	saveUninitialized: false
	// ^^ resave && saveUninitialized are required buy the session module - maybe read into these more
}));

// lets ensure passport is being used - always need these two
app.use(passport.initialize());
app.use(passport.session());

// two really important calls - reading the session and decoding it, then encoding it - these are passed in from the user.js UserSchema.plugin call
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// third authenticate the login
passport.use(new LocalStrategy(User.authenticate()));

// IMPORTANT - pass the current user into every route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
})

app.use(express.static(path.join(__dirname, 'public')));
// allows the body of requests to be retrieved from a form
app.use(bodyParser.urlencoded({extended:true}));

// prevents harmful script being injected into fields
app.use(expressSantizer());

// HTML forms doesn't support PUT or DELETE so to follow conventions we must use this method override
// form action will have a query string on the end ?_method=PUT
app.use(methodoverride('_method'));

// start using the routes - must be after body parser
app.use(indexRoutes);
// '/forsale' passed here sets as the default for all forsale routes
app.use('/forsale', forSaleRoutes);

/*

	START THE SERVER LOCALLY

*/

app.listen(3000, function() {
	console.log('Agent free is listening...');
});


