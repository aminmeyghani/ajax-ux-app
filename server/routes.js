var express  = require('express');
var path     = require('path');
var app      = express();
var settings = require('./settings');

module.exports = function(app) {
// Sets the root for the static files.
app.use(express.static(__dirname + settings.servePath));

// route for root request.
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

};


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