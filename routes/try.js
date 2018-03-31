var https = require('https');
var Client = require('node-rest-client').Client;
/**
 * Get Message - GET
 */
// options for GET
 

module.exports = {
  tryCall: function (req, res) {
	  console.log("Trycall Called")
    var name = "Vivek";
	var client = new Client();
 
	// direct way 
	client.get("http://192.168.1.32:5555/api/data/add?doc=amol", function (data, response) {
	    // parsed response body as js object 
	    console.log(data);
	    // raw response 
	    console.log(response);
	});

	
    }
  }
