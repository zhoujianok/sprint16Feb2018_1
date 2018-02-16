require('mongoose').model('colorshades');
require('mongoose').model('counters');

var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var Client = require('node-rest-client').Client;
var colorshade = mongoose.model('colorshades');
var JQuery = require('jquery')
var config = require('../config')
var common = require('./common')
var countersmodel = mongoose.model('counters');
var db = require('../routes/db');
var fileupload = require('./fileupload');
var UserAuth = mongoose.model('userAuthorization');
var countersmodel = mongoose.model('counters');

var splittedCollection = []

function formatDate(date) {
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    return year + '-' + monthIndex + 1 + '-' + day + ' ' + hour + ':' + min + ':' + sec;
}

module.exports = {
    // creates a shade 
    createUsers: function (req, res) {
        var shade = req.body;
        console.log("SHADE");
        console.log(shade);
        countersmodel.findOneAndUpdate({ _id: 'userid' }, { $inc: { seq: 1 } }, { new: true }, function (err, doc) {
            if (err) {
                console.log("Something wrong when updating data!");
            }
            req.body["Sprint_Id"] = doc.seq;
            var data = ({
                //"Sprint_Id": db.getcounter('userid'),
                "Sprint_Id": shade.Sprint_Id,
                "Name_of_Campaign": shade.Name_of_Campaign,
                "Date_Campaign": shade.Date_Campaign,
                "Group": shade.Group,
                "Division": shade.Division,
                "Brand": shade.Brand,
                "Line": shade.Line,
                "Type_of_Product": shade.Type_of_Product,
                "Product_Form": shade.Product_Form,
                "Formula_Number": shade.Formula_Number,
                "Commercial_Shade_Name": shade.Commercial_Shade_Name,
                "Technical_Number": shade.Technical_Number,
                "Commercial_Number": shade.Commercial_Number,
                "Level": shade.Level,
                "Booster_Formula_Number": shade.Booster_Formula_Number,
                "Alkaline_Agent": shade.Alkaline_Agent,
                "Quantity_49": shade.Quantity_49,
                "Quantity_671": shade.Quantity_671,
                "Developer_Strength": shade.Developer_Strength,
                "Developer_Formula_Number": shade.Developer_Formula_Number,
                "Mixture": shade.Mixture,
                "Processing_Time_min": shade.Processing_Time_min,
                "Fiber_Code": shade.Fiber_Code,
                "Type_of_Fibre": shade.Type_of_Fibre,
                "Fiber": shade.Fiber,
                "Percent_White": shade.Percent_White,
                "Fiber_Origin": shade.Fiber_Origin,
                "L_Transposed": shade.L_Transposed,
                "a_Transposed": shade.a_Transposed,
                "b_Transposed": shade.b_Transposed,
                "C_Transposed": shade.C_Transposed,
                "H_Transposed": shade.H_Transposed,
                "Reflect": shade.Reflect,
                "Primary_Reflect": shade.Primary_Reflect,
                "Secondary_Reflect": shade.Secondary_Reflect,

                "Added_On": formatDate(new Date())
            })

            colorshade.insertMany([data], function (err, docs) {
                if (err) {
                    // console.log("ERROR => " + err);
                    res.status(504);
                    res.end(err);
                }
                else {
                    if (req.body.ImageStr.length > 0) {
                        fileupload.ImageUpload(req, res)
                    }
                    res.send(docs);
                    //res.status(200).json(docs);
                }
            })
        });
    },

    // get a single record by id
    seeResult: function (req, res, next) {
        //console.log(req.params)
        colorshade.findOne({ _Id: req.params._id }, function (err, docs) {
            if (err) {
                res.status(504);
                res.end(err);
            } else {
                //console.log(docs);
                res.end(JSON.stringify(docs));
            }
        });

    },

    // get the entire database
    seeResults: function (req, res, next) {
        var page = req.params.page
        var limit = 1000;

        var query = colorshade.find({}).skip(limit * page).limit(limit);
        query.exec(function (err, docs) {
            if (err) {
                res.status(504);
                res.end(err);
            } else {
                res.end(JSON.stringify(docs));
            }
        });
    },

    // get the entire colorshade count
    statistics: function (req, res, next) {
        var totalProducts = 0;
        var lorealProducts = 0;
        var otherProducts = 0;
        colorshade.count({}, function (err, count) {
            totalProducts = count;
        });
        colorshade.count({ Group: 'L_OREAL' }, function (err, count) {
            lorealProducts = count;
            otherProducts = totalProducts - lorealProducts;
            UserAuth.count({ "isActive": true }, function (err, count) {
                res.end(JSON.stringify({ "Count": totalProducts, "Loreal_Product_Count": lorealProducts, "Other_Product_Count": otherProducts, "last_Modified_Date": null, "total_users": count }));
            })
        });

        //colorshade.find({}, function (err, docs) {
        //    if (err) {
        //        res.status(504);
        //        res.end(err);
        //    } 

        //    var loreal_products = docs.filter(function (o) {
        //        return (o.Group === 'L_OREAL');
        //    });
        //    var other_products = docs.filter(function (o) {
        //        return (o.Group != 'L_OREAL');
        //    });

        //    var last_date = docs.length > 0 ? docs[docs.length - 1].Added_On : null;
        //    //console.log(loreal_products.length, " ", other_products.length)
        //    res.end(JSON.stringify({ "Count": docs.length, "Loreal_Product_Count": loreal_products.length, "Other_Product_Count": other_products.length, "last_Modified_Date": last_date }));
        //    //}
        //});
    },

    // deletes all the entries made recently (last date of entry)
    revertUpload: function (req, res, next) {
        //console.log("req.params.Added_On => " + req.params.Added_On);
        colorshade.remove({ logid: req.params.Added_On }, function (err, user) {
            if (err) {
                res.send(err, req.params)
                console.log(err);
            }
            common.deleteUserLogs(req.params.Added_On)
            res.json(user)
        })
    },

    // filter values 
    getRange: function (req, res, next) {
        var filter = req.body;
        filterobj = {
            a_Transposed: { $gte: filter.a_min, $lte: filter.a_max },
            b_Transposed: { $gte: filter.b_min, $lte: filter.b_max },
            L_Transposed: { $gte: filter.L_min, $lte: filter.L_max },
            Type_of_Fibre: { $in: filter.Type_of_Fibre },
            Fiber: { $in: filter.Fiber },
            Percent_White: { $in: filter.Percent_White },
            Fiber_Origin: { $in: filter.Fiber_Origin },
            Group: { $in: filter.Group },
            Processing_Time_min: { $in: filter.Processing_Time_min },
            Developer_Strength: { $in: filter.Developer_Strength },
            Brand: { $in: filter.Brand }
        }

        colorshade.find(filterobj, function (err, docs) {
            if (err) {
                res.status(504);
                res.end(err);
                res.write('an error occured')
            } else {
                //console.log("docs data :=> ");
                //console.log(docs);
                var client = new Client();
                var args = {
                    data: {
                        "data": JSON.stringify(docs), "filter": filter
                    },
                    headers: { "Content-Type": "application/json" }
                };
                client.post(config.flask.endpoint + "/api/calculate/deltavalues", args, function (data, response) {
                    //console.log("ARG data :=> ");
                    //console.log(data);
                    res.status(200).json(data);
                });
            }
        });
    },

    getFullData: function (req, res, next) {
        var filter = req.body;

        colorshade.find({}, function (err, docs) {
            if (err) {
                res.status(504);
                res.end(err);
                res.write('an error occured')
            } else {
                console.log("Full data :=> ");
                //console.log(docs);
                var client = new Client();
                var args = {
                    data: {
                        "data": JSON.stringify(docs), "filter": filter
                    },
                    headers: { "Content-Type": "application/json" }
                };
                client.post(config.flask.endpoint + "/api/calculate/deltavalues", args, function (data, response) {
                    //console.log("ARG data :=> ");
                    //console.log(data);
                    res.status(200).json(data);
                });
            }
        });
    },

    // delete a particular entry by id
    delete: function (req, res, next) {
        colorshade.findOneAndRemove({ _id: req.params.id }, function (err, user) {
            if (err) {
                res.status(500).json(err);
                //res.send(err, req.params)
                console.log(err);
            }
            res.json(user)
        })
    },

    // update the values where the id matched
    update: function (req, res) {
        var obj = req.body;
        //console.log("UPDATE => ");
        //console.log(obj);
        colorshade.findOneAndUpdate(
            { _id: obj._id },
            {
                "Name_of_Campaign": obj.Name_of_Campaign,
                "Brand": obj.Brand,
                "Line": obj.Line,
                "Group": obj.Group,
                "Commercial_Number": obj.Commercial_Number,
                "Formula_Number": obj.Formula_Number,
                "Alkaline_Agent": obj.Alkaline_Agent,
                "Booster_Formula_Number": obj.Booster_Formula_Number,
                "Quantity_49": obj.Quantity_49,
                "Quantity_671": obj.Quantity_671,
                "Developer_Strength": obj.Developer_Strength,
                "Developer_Formula_Number": obj.Developer_Formula_Number,
                "Mixture": obj.Mixture,
                "Processing_Time_min": parseInt(obj.Processing_Time_min),
                "Fiber_Code": obj.Fiber_Code,
                "Type_of_Fibre": obj.Type_of_Fibre,
                "Fiber": obj.Fiber,
                "Percent_White": parseInt(obj.Percent_White),
                "Fiber_Origin": obj.Fiber_Origin,
                "L_Transposed": parseFloat(obj.L_Transposed),
                "a_Transposed": parseFloat(obj.a_Transposed),
                "b_Transposed": parseFloat(obj.b_Transposed),
                "C_Transposed": parseFloat(obj.C_Transposed),
                "H_Transposed": parseFloat(obj.H_Transposed),
                "Reflect": obj.Reflect,
                "Primary_Reflect": obj.Primary_Reflect,
                "Secondary_Reflect": obj.Secondary_Reflect
            }
            , function callback(err, docs) {
                // numAffected is the number of updated documents
                //console.log(docs)
                if (err) {
                } else if (!docs) {
                } else {
                    //console.log("docs => ")
                    //console.log(docs)
                    if (req.body.ImageStr.length > 0) {
                        fileupload.ImageUpload(req, res)
                    }
                    //fileupload.ImageUpload(req, res)
                    //return res.send(200, docs);
                    return res.send(docs);
                }
            })
    },

    // get the sprint id counter
    getCounter: function (name) {
        countersmodel.findOneAndUpdate({ _id: name }, { $set: { $inc: { seq: 1 } } }, { new: true }, function (err, doc) {
            if (err) {
                console.log("Something wrong when updating data!");
            }
            return doc;
        });
    },
    resetCounter: function (name) {
        countersmodel.findOneAndUpdate({ _id: name }, { $set: { seq: 0 } }, { new: true }, function (err, doc) {
            if (err) {
                console.log("Something wrong when updating data!");
            }
            return doc;
        });
    },
    testRes: function (id) {
        colorshade.findOne({ Sprint_Id: id }, function (err, docs) {
            if (err) {
                console.log(err);
            } else {
                console.log(docs);
            }
        });
    }
}

function splitiing(data) {
    var splitdata = data.split(',');
    for (i = 0; i < splitdata.length; i++) {
        splittedCollection.push(splitdata[i].trim())
    }
    return splittedCollection;
}
