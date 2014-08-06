# Ajax UX App
An ajax app with angular.

1. clone the repo
2. go to the folder and do `npm install && grunt serve`
3. Provide your own db settings in a file called `db.js` and put it in the `server` folder. Eventually the folder will 
look like this:

```
server
├── bin
│   └── www
├── db.js
├── routes.js
└── settings.js
```

This is the protocol of the `db.js` file:

	// database settings
	var mysql = require('mysql');
	
	var connection = mysql.createConnection({
	  port:    3306,
	  host     : '',
	  user     : '',
	  password : '',
	  database: ''
	});
	connection.connect();
	
	module.exports = connection;

server will be running at port 8123: `http://localhost:8123`

