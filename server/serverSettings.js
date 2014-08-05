// Server settings.
var express  = require('express');
var path     = require('path');
var app      = express();
var serveFolder = "public";
var _settings = {
	port: 8123,
	rootPath: "/",
	servePath: "/../"+serveFolder
};

// Sets the root for the static files.
// up a directory in the public folder.
app.use(express.static(__dirname + _settings.servePath));

// when the request comes in for "/", get index with respect to the current directory of the app.
app.get( _settings.rootPath, function( req, res ){
    res.sendfile(serveFolder+'/index.htm', { root: "."});
});

// am: expose api to be used by the www script runner.
var exp = {  
	express: app,
	settings: _settings
};
module.exports = exp;
