var Client = require('node-rest-client').Client;
var config = require('../config')

module.exports = {
    getClusters: function (req, res) {
        //console.log(req.body)
        var data = req.body;
        //console.log(data);
        //console.log('stopped')
        var args = {
            data: data,
            headers: { "Content-Type": "application/json" }
        };        

        var client = new Client();

        client.post(config.flask.endpoint + "/api/calculate/clusters", args, function (data, response) {
            //console.log('stopped 1')    
            //console.log(data);            
            //console.log(response);

            //if (response.statusCode != 200)
            //{
            //    res.status(response.status).json(response.statusMessage);
            //}

            res.status(200).json(data);
        });
        //console.log('stopped 2')
    },

    getNearestFormula: function (req, res) {
        //console.log(req.body)
        var data = req.body;
        //console.log(data);

        var args = {
            data: data,
            headers: { "Content-Type": "application/json" }
        };

        var client = new Client();

        client.post(config.flask.endpoint + "/api/calculate/nearest_formula", args, function (data, response) {

            //console.log(data);
            //console.log(response);

            //if (response.status != 200) {
            //    res.status(response.status).json("Some Error Occured");
            //}
            
            res.status(200).send(data);
        });
    }
}