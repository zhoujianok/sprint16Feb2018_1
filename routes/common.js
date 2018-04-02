require('mongoose').model('counters')
require('mongoose').model('colorshades');
require('mongoose').model('file_upload_log');
//require('mongoose').model('counters');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var Client = require('node-rest-client').Client;
var config = require('../config')
// models
//var colorshade = mongoose.model('counters');
var colorshade = mongoose.model('colorshades');
var file_upload_log = mongoose.model('file_upload_log');

//var User = mongoose.model('user');

module.exports = {
    //tryone: function (name) {
    //    console.log(name)
    //    return name;
    //},

    //_isContains: function (json, value) {
    //    let contains = false;
    //    Object.keys(json).some(key => {
    //        contains = typeof json[key] === 'object' ? _isContains(json[key], value) : json[key] === value;
    //        return contains;
    //    });
    //    return contains;
    //},

    //getCounter: function (name) {
    //    colorshade.findOneAndUpdate({ _id: name }, { $set: { $inc: { seq: 1 } } }, { new: true }, function (err, doc) {
    //        if (err) {
    //            console.log("Something wrong when updating data!");
    //        }

    //        console.log(doc);
    //        return doc;
    //    });
    //},

    getTypeOfFibres: function (req, res) {
        result = [];
        colorshade.find().distinct('Type_of_Fibre', function (error, data) {
            result = data;
            res.status(200).json(result);
        });
    },

    getBindValues: function (req, res) {
        _result = {};
        getDistinct();
        //colorshade.find().distinct('Group', function (error, data) {
        //    result['Group'] = data;
        //}).distinct('Type_of_Fibre', function (error, data) {
        //    result['Type_of_Fibre'] = data;
        //}).distinct('Fiber', function (error, data) {
        //    result['Fiber'] = data;
        //}).distinct('Percent_White', function (error, data) {
        //    result['Percent_White'] = data
        //}).distinct('Fiber_Origin', function (error, data) {
        //    result['Fiber_Origin'] = data;
        //}).distinct('Processing_Time_min', function (error, data) {
        //    result['Processing_Time_min'] = data;
        //}).distinct('Developer_Strength', function (error, data) {
        //    result['Developer_Strength'] = data;
        //    //console.log("result => ")
        //    //console.log(result)
        //    res.status(200).json(result);
        //    });

        //function getGroups() {
        //    colorshade.find().distinct('Group', function (error, data) {
        //        //console.log("GROUP => " + data);
        //        //result['Group'] = data;
        //        _getGroups();
        //    });
        //}

        function getDistinct() {
            colorshade.find({}, {
                "Group": Number(1),
                "Type_of_Fibre": Number(1),
                "Fiber": Number(1),
                "Percent_White": Number(1),
                "Fiber_Origin": Number(1),
                "Processing_Time_min": Number(1),
                "Developer_Strength": Number(1),
                "Brand": Number(1)
            }, function (error, data) {
                var uniqueGroups = [];
                var uniqueTypeOfFibre = [];
                var uniqueFiber = [];
                var uniquePercentWhite = [];
                var uniqueFiberOrigin = [];
                var uniqueProcessingTimeMin = [];
                var uniqueDeveloperStrength = [];
                var uniqueBrand = [];

                for (i = 0; i < data.length; i++) {
                    if (uniqueGroups.indexOf(data[i].Group) === -1) {
                        uniqueGroups.push(data[i].Group);
                    }

                    if (uniqueTypeOfFibre.indexOf(data[i].Type_of_Fibre) === -1) {
                        uniqueTypeOfFibre.push(data[i].Type_of_Fibre);
                    }

                    if (uniqueFiber.indexOf(data[i].Fiber) === -1) {
                        uniqueFiber.push(data[i].Fiber);
                    }

                    if (uniquePercentWhite.indexOf(data[i].Percent_White) === -1) {
                        uniquePercentWhite.push(data[i].Percent_White);
                    }

                    if (uniqueFiberOrigin.indexOf(data[i].Fiber_Origin) === -1) {
                        uniqueFiberOrigin.push(data[i].Fiber_Origin);
                    }

                    if (uniqueProcessingTimeMin.indexOf(data[i].Processing_Time_min) === -1) {
                        uniqueProcessingTimeMin.push(data[i].Processing_Time_min);
                    }

                    if (uniqueDeveloperStrength.indexOf(data[i].Developer_Strength) === -1) {
                        uniqueDeveloperStrength.push(data[i].Developer_Strength);
                    }

                    if (uniqueBrand.indexOf(data[i].Brand) === -1) {
                        uniqueBrand.push(data[i].Brand);
                    }
                }
                _result['Group'] = uniqueGroups;
                _result['Type_of_Fibre'] = uniqueTypeOfFibre;
                _result['Fiber'] = uniqueFiber;
                _result['Percent_White'] = uniquePercentWhite;
                _result['Fiber_Origin'] = uniqueFiberOrigin;
                _result['Processing_Time_min'] = uniqueProcessingTimeMin;
                _result['Developer_Strength'] = uniqueDeveloperStrength;
                _result['Brand'] = uniqueBrand;
                getResult();
            });
        }

        //function getGroups() {
        //    colorshade.find({}, {
        //        "Group": Number(1)
        //    }, function (error, data) {
        //        var uniqueGroups = [];
        //        for (i = 0; i < data.length; i++) {
        //            if (uniqueGroups.indexOf(data[i].Group) === -1) {
        //                uniqueGroups.push(data[i].Group);
        //            }
        //        }
        //        _result['Group'] = uniqueGroups;
        //        getTypeOfFibres();
        //    });
        //}


        //function getTypeOfFibres() {
        //    colorshade.find({}, { "Type_of_Fibre": Number(1) }, function (error, data) {
        //        var uniqueTypeOfFibre = [];
        //        for (i = 0; i < data.length; i++) {
        //            if (uniqueTypeOfFibre.indexOf(data[i].Type_of_Fibre) === -1) {
        //                uniqueTypeOfFibre.push(data[i].Type_of_Fibre);
        //            }
        //        }
        //        _result['Type_of_Fibre'] = uniqueTypeOfFibre;
        //        getFibers();
        //    });
        //}

        //function getFibers() {
        //    //colorshade.find('Fiber', function (error, data) {
        //    //    _result['Fiber'] = data;
        //    //    getPercentWhites();
        //    //});

        //    colorshade.find({}, { "Fiber": Number(1) }, function (error, data) {
        //        var uniqueFiber = [];
        //        for (i = 0; i < data.length; i++) {
        //            if (uniqueFiber.indexOf(data[i].Fiber) === -1) {
        //                uniqueFiber.push(data[i].Fiber);
        //            }
        //        }
        //        _result['Fiber'] = uniqueFiber;
        //        getPercentWhites();
        //    });
        //}

        //function getPercentWhites() {
        //    //colorshade.find('Percent_White', function (error, data) {
        //    //    _result['Percent_White'] = data;
        //    //    getFiberOrigins();
        //    //});

        //    colorshade.find({}, { "Percent_White": Number(1) }, function (error, data) {
        //        var uniquePercentWhite = [];
        //        for (i = 0; i < data.length; i++) {
        //            if (uniquePercentWhite.indexOf(data[i].Percent_White) === -1) {
        //                uniquePercentWhite.push(data[i].Percent_White);
        //            }
        //        }
        //        _result['Percent_White'] = uniquePercentWhite;
        //        getFiberOrigins();
        //    });
        //}

        //function getFiberOrigins() {
        //    //colorshade.find('Fiber_Origin', function (error, data) {
        //    //    _result['Fiber_Origin'] = data;
        //    //    getProcessingTimeMins();
        //    //});

        //    colorshade.find({}, { "Fiber_Origin": Number(1) }, function (error, data) {
        //        var uniqueFiberOrigin = [];
        //        for (i = 0; i < data.length; i++) {
        //            if (uniqueFiberOrigin.indexOf(data[i].Fiber_Origin) === -1) {
        //                uniqueFiberOrigin.push(data[i].Fiber_Origin);
        //            }
        //        }
        //        _result['Fiber_Origin'] = uniqueFiberOrigin;
        //        getProcessingTimeMins();
        //    });
        //}

        //function getProcessingTimeMins() {
        //    //colorshade.find('Processing_Time_min', function (error, data) {
        //    //    _result['Processing_Time_min'] = data;
        //    //    getDeveloperStrengths();
        //    //});

        //    colorshade.find({}, { "Processing_Time_min": Number(1) }, function (error, data) {
        //        var uniqueProcessingTimeMin = [];
        //        for (i = 0; i < data.length; i++) {
        //            if (uniqueProcessingTimeMin.indexOf(data[i].Processing_Time_min) === -1) {
        //                uniqueProcessingTimeMin.push(data[i].Processing_Time_min);
        //            }
        //        }
        //        _result['Processing_Time_min'] = uniqueProcessingTimeMin;
        //        getDeveloperStrengths();
        //    });
        //}

        //function getDeveloperStrengths() {
        //    //colorshade.find('Developer_Strength', function (error, data) {
        //    //    _result['Developer_Strength'] = data;
        //    //    getBrands();
        //    //});

        //    colorshade.find({}, { "Developer_Strength": Number(1) }, function (error, data) {
        //        var uniqueDeveloperStrength = [];
        //        for (i = 0; i < data.length; i++) {
        //            if (uniqueDeveloperStrength.indexOf(data[i].Developer_Strength) === -1) {
        //                uniqueDeveloperStrength.push(data[i].Developer_Strength);
        //            }
        //        }
        //        _result['Developer_Strength'] = uniqueDeveloperStrength;
        //        getBrands();
        //    });
        //}

        //function getBrands() {
        //    //colorshade.find('Brand', function (error, data) {
        //    //    _result['Brand'] = data;
        //    //    getResult();
        //    //});

        //    colorshade.find({}, { "Brand": Number(1) }, function (error, data) {
        //        var uniqueBrand = [];
        //        for (i = 0; i < data.length; i++) {
        //            if (uniqueBrand.indexOf(data[i].Brand) === -1) {
        //                uniqueBrand.push(data[i].Brand);
        //            }
        //        }
        //        _result['Brand'] = uniqueBrand;
        //        getResult();
        //    });
        //}

        function getResult() {
            //console.log("result => ")
            //console.log(_result)
            res.status(200).json(_result);
        }
    },

    getUserLogs: function (req, res) {
        //console.log(req.params.userid)
        var client = new Client();

        var url = config.flask.endpoint + "/api/Logs?userid=" + req.params.userid;

        client.get(url, function (data, response) {
            //console.log(data)
            res.end(JSON.stringify(data));
        })
    },

    deleteUserLogs: function (logid) {
        //console.log(file_upload_log)
        var client = new Client();

        var url = config.flask.endpoint + "/api/deleteLogs?logid=" + logid;

        client.get(url, function (data, response) {
            //console.log(data)
            //res.end(JSON.stringify(data));
        })
    },

    resetUserLogs: function () {
        //console.log(file_upload_log)
        var client = new Client();

        var url = config.flask.endpoint + "/api/resetLogs";

        client.get(url, function (data, response) {
            console.log(data)
            //res.end(JSON.stringify(data));
        })
    }
}