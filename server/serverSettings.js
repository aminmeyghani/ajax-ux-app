// Server settings.
var express  = require('express');
var path     = require('path');
var app      = express();
var serveFolder = "public";
var middleware = require('middleware');
var indexFile = "/index.htm";
var _settings = {
	port: 3000,
	rootPath: "/",
	servePath: "/../"+serveFolder
};

// Sets the root for the static files.
// up a directory in the public folder.
app.use(express.static(__dirname + _settings.servePath));

// when the request comes in for "/", get index with respect to the current directory of the app.
app.get( _settings.rootPath, function( req, res ){
	console.log("sending index over ...")
	// res.status(400).end()
    res.sendfile(serveFolder+indexFile, { root: "."});
});

app.get('*', function(req, res, next) {
	console.log("there was here alll catch ***************")
	res.status(404);
	// res.sendfile(serveFolder+"/index.htm", { root: "."});
	// res.sendfile(serveFolder+'/index.htm', { root: "."});
 //  var err = new Error();
 //  console.log(err.status);
 //  err.status = 404;
 //  next(err);
 // res.status(400).end()
});
 
// handling 404 errors
// app.use(function(err, req, res, next) {
//   if(err.status !== 404) {
//     return next();
//   }
//   res.send(err.message || 'nothing found ....');
// });

/*
app.get('/partials/:partial', function(req, res) {
    return res.render('partials/' + req.params['partial']);
};
*/


// am: expose api to be used by the www script runner.
var exp = {  
	express: app,
	settings: _settings
};
module.exports = exp;
