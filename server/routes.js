var express  = require('express');
var path     = require('path');
var app      = express();
var settings = require('./settings');
var connection = require("./db");

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

  // json response test 
  app.get('/data', function(req, res){
      res.json({
          "name" : "Amin", 
          "lastname" : "Meyghani", 
          "age" : 22
      });
  });

  // data from db
  app.get('/books', function(req, res){
    connection.query('SELECT * from books', function(err, rows, fields) {
      if (err) throw err;
      res.json(rows)
    });
  });

  /* prototype for update post.
    app.post('/data', function(req, res){
        db.run("query", function(err, row){
            if (err){
                console.err(err);
                res.status(500);
            }
            else {
                res.status(202);
            }
            res.end();
        });
    });
  */

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