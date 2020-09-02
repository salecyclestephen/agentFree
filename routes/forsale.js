const express = require('express');
const router = express.Router();
const House = require('../models/house');


// INDEX ROUTE - GET all houses for sale page.
router.get('/', function(req, res) {
	House.find({}, function(err, housesForSale) {
		if (err) {
			console.log('find failed....');
		} else {
			res.render('index', {housesForSale: housesForSale});
		}
	})
});

// NEW ROUTE show form to add a new home
router.get('/new', isLoggedIn, function(req, res) {
	res.render('new');
});

// CREATE ROUTE POST to post the new home
router.post('/', function(req, res) {

	// lets add the date...
	let date = new Date();
	date = date.toISOString().slice(0, 19).replace('T', ' ');

	const houseNumber = req.body.houseNumber;
	const streetName = req.body.streetName;
	const postCode = req.body.postCode;
	const houseImage = req.body.image;
	const askingPrice = req.body.askingPrice;
	const dateAdded = date;
	const modifiedDate = date;
	const newHouse = { houseNumber, streetName, postCode, image: houseImage, askingPrice, dateAdded, modifiedDate };

	House.create(newHouse, function(err, house)  {
		if (err) {
			console.log('something went wrong ' + err);
		} else {
			res.redirect('/');
		}
	})
})

// SHOW ROUTE - when clicking on a home it shows more info
router.get('/:id', function(req, res) {
	House.findById(req.params.id, function(err, foundHouse){
		if (err) {
			console.log('something went wrong show ' + err);
		} else {
			res.render('show', {foundHouse: foundHouse});
		}
	});
});

// EDIT ROUTE - combination of SHOW and UPDATE
router.get('/:id/edit', isLoggedIn, function(req, res) {
	House.findById(req.params.id, function(err, foundHouse){
		if (err) {
			console.log('something went wrong edit route ' + err);
		} else {
			res.render('edit', {foundHouse: foundHouse});
		}
	});
});

// UPDATE ROUTE -- METHOD OVERRIDE NEEDED HERE
router.put('/:id', function(req, res) {

	// lets add the modified date...
	let date = new Date();
	date = date.toISOString().slice(0, 19).replace('T', ' ');
	Object.assign(req.body, {modifiedDate: date})

	House.findByIdAndUpdate(req.params.id, req.body, function(err, updatedListing) {
		if (err) {
			console.log('something went wrong update route ' + err);
		} else {
			res.redirect('/forsale/' + req.params.id);
		}
	});
});


// DELETE (DESTROY) ROUTE
router.delete('/:id', function(req, res) {
	House.findByIdAndRemove(req.params.id, function(err, updatedListing) {
		if (err) {
			console.log('something went wrong delete route ' + err);
		} else {
			res.redirect('/forsale');
		}
	});
});

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