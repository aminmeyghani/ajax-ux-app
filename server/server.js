// Server settings.
var express  = require('express');
var path     = require('path');
var app      = express();
var settings = require('./settings');

// Sets the root for the static files.
// up a directory in the public folder.
app.use(express.static(__dirname + settings.servePath));

// when the request comes in for "/", get index with respect to the current directory of the app.
app.get( "/", function( req, res ){
    res.sendfile(settings.publicFolder+settings.indexFile, { root: "."});
});

// route for dashboard
app.get( "/dashboard", function( req, res ){
		console.log("re-routing to dashboard");
    res.redirect(302, "/#/dashboard");
});

// send a 404 for any other routes that is not found and reroute to home.
app.get('*', function(req, res, next) {
	console.log("404: "+req.originalUrl+ " was not found")
	res.status(404).redirect("/#/404");	
});


// export the server routes and settings to be passed to www.
module.exports = app;