// Server settings.
var express      = require('express');
var path         = require('path');
var app          = express();
var serverConfig = require('./settings');
var middleware   = require('middleware');

// Sets the root for the static files.
// up a directory in the public folder.
app.use(express.static(__dirname + serverConfig.servePath));

// when the request comes in for "/", get index with respect to the current directory of the app.
app.get( "/", function( req, res ){
    res.sendfile(serverConfig.publicFolder+serverConfig.indexFile, { root: "."});
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

// error handling template
/*
app.get('*', function(req, res, next) {
  var err = new Error();
  err.status = 404;
  next(err);
});
 
// handling 404 errors
app.use(function(err, req, res, next) {
  if(err.status !== 404) {
    return next();
  }
 
  res.send(err.message || '** no unicorns here **');
});
*/


// am: expose api to be used by the www script runner.
var exp = {  
	express: app,
	settings: serverConfig
};
module.exports = exp;