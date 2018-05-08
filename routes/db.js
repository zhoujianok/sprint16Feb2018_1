var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var config = require('../config')
var enc = require('./encryption');
//var common = require('../routes/common')


var colorshades = new mongoose.Schema({
    Sprint_Id: Number,
    Name_of_Campaign: { type: String },
    Date_Campaign: String,
    Group: String,
    Division: String,
    Brand: String,
    Line: String,
    Type_of_Product: String,
    Product_Form: String,
    Formula_Number: String,
    Commercial_Shade_Name: String,
    Technical_Number: Number,
    Commercial_Number: String,
    Level: Number,
    Booster_Formula_Number: String,
    Alkaline_Agent: Number,
    Quantity_49: Number,
    Quantity_671: Number,
    Developer_Strength: String,
    Developer_Formula_Number: String,
    Mixture: String,
    Processing_Time_min: Number,
    Fiber_Code: String,
    Type_of_Fibre: String,
    Fiber: String,
    Percent_White: Number,
    Fiber_Origin: String,
    L_Transposed: Number,
    a_Transposed: Number,
    b_Transposed: Number,
    C_Transposed: Number,
    H_Transposed: Number,
    Added_On: String,
    logid: Number,
    Reflect: String,
    Primary_Reflect: String,
    Secondary_Reflect: String
});

var counters = new mongoose.Schema({
    _id: { type: String },
    seq: Number
});

var logcounters = new mongoose.Schema({
    _id: { type: String },
    seq: Number
});

var user = new mongoose.Schema({
    username: String,
    password: String
})

var userAuthorization = new mongoose.Schema({
    firstname: String,
    lastname: String,
    contact: String,
    email: String,
    username: String,
    password: String,
    role: String,
    isActive: Boolean,
    CreatedDate: String
})

var file_upload_log = new mongoose.Schema({
    logid: Number,
    date: String,
    userid: String
});


mongoose.Promise = require('bluebird');
mongoose.model('colorshades', colorshades);
mongoose.model('counters', counters);
mongoose.model('logcounters', logcounters);
mongoose.model('user', user);
mongoose.model('userAuthorization', userAuthorization);
mongoose.model('file_upload_log', file_upload_log);
//mongoose.connect('mongodb://' + config.mongodb.host + "/" + config.mongodb.dbname);
mongoose.connect('mongodb://sprintcosmosdb:yBryuVwu5hZ0mS9kNHnOA7o2gioEatlk9HTVgBE8a7tn8L3zoSxNLwpEiOTGAHq1kqsYWBWiHGzH7k8hBVPQLw==@sprintcosmosdb.documents.azure.com:10255/LorialTestDB?ssl=true');

var countersmodel = mongoose.model('counters');
var logcountersmodel = mongoose.model('logcounters');
var userauth = mongoose.model('userAuthorization');
//console.log(countersmodel)


module.exports = {
    getcounter: function (name) {
        countersmodel.findOneAndUpdate({ _id: name }, { $inc: { seq: 1 } }, { new: true }, function (err, doc) {
            if (err) {
                console.log("Something wrong when updating data!");
            }

            //console.log(doc);
            return doc;
        });
    }
}

//console.log(getcounter("userid"))

mongoose.connection.on('open', function () {
    mongoose.connection.db.listCollections().toArray(function (err, names) {
        if (err) {
            console.log(err);
        } else {
            //console.log(names[1].name);

            userauth.find({}, function (err, docs) {
                if (docs.length == 0) {
                    userauth.insertMany([{
                        "firstname": "superadmin",
                        "lastname": "superadmin",
                        "contact": config.su_contact,
                        "email": config.su_email,
                        "username": config.su_username,
                        "password": enc.encrypt(config.encryptionKey, config.su_password),
                        "role": "superadmin",
                        "isActive": true,
                        "CreatedDate": new Date().toDateString()
                    }], function (err, user) {
                        console.log("SU created");
                    })
                }
            })

            if (!(_isContains(names, "counters"))) {
                var initcounter = new countersmodel({
                    _id: "userid",
                    seq: 0
                });

                initcounter.save(function (err) {
                    if (err) {
                        return err;
                    }
                    else {
                        console.log("counters saved");
                    }
                });
            }

            // create and initialize the log counter
            if (!(_isContains(names, "logcounters"))) {
                var initcounter = new logcountersmodel({
                    _id: "logid",
                    seq: 0
                });

                initcounter.save(function (err) {
                    if (err) {
                        return err;
                    }
                    else {
                        console.log("log counters saved");
                    }
                });
            }
        }

        //mongoose.connection.close();
    });
});
//console.log(user.getCounter("userid"))
console.log('we are connected');

// privae functions 
function _isContains(json, value) {
    let contains = false;
    Object.keys(json).some(key => {
        contains = typeof json[key] === 'object' ? _isContains(json[key], value) : json[key] === value;
        return contains;
    });
    return contains;
}

