// Server settings.
var express  = require('express');
var path 		 = require('path');
var app      = express();   
var port     = 8123;
var rootPath = "public";

// Serve static files.
app.use(express.static(path.join(__dirname, rootPath)));

// Set port.
app.listen(port);
console.log("Server listening on port %d ...", port);