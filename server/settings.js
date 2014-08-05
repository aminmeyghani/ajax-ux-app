// server settings.
var settings = new function () {
		this.port =  8909;
		this.publicFolder = "public";
		this.servePath =  "/../" + this.publicFolder;
		this.indexFile =  "/index.htm"
};
module.exports = settings;