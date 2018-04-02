require('mongoose').model('counters');
require('mongoose').model('userAuthorization');
//require('mongoose').model('counters');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var Client = require('node-rest-client').Client;
var crypto = require('crypto');
var enc = require('./encryption');
var config = require('../config')

// models
var colorshade = mongoose.model('counters');
var User = mongoose.model('user');
var UserAuth = mongoose.model('userAuthorization');

module.exports = {

    //login: function (req, res) {
    //    User.findOne({ username: req.body.username }, function (err, user) {

    //        var data = req.body.username + ":" + req.body.password;
    //        var hex = crypto.createHash('md5').update(data).digest("hex");

    //        res.status(200).json({ username: req.body.username, password: req.body.password, token: hex });
    //    });
    //},
    login: function (req, res) {
        UserAuth.findOne({ "username": req.body.username, "password": enc.encrypt(config.encryptionKey, req.body.password), "isActive": true }, function (err, user) {
            res.status(200).json(user);
        });
    },
    getUser: function (req, res) {
        var inputUser = req.body;
        UserAuth.findOne({ "_id": inputUser._id }, function (err, doc) {
            //console.log(doc);
            res.status(200).json(doc);
        })
    },
    addUser: function (req, res) {
        var inputUser = req.body;
        UserAuth.insertMany([{
            "firstname": inputUser.firstname,
            "lastname": inputUser.lastname,
            "contact": inputUser.contact,
            "email": inputUser.email,
            "username": inputUser.username,
            "password": enc.encrypt(config.encryptionKey, inputUser.password),
            "role": inputUser.role,
            "isActive": true,
            "CreatedDate": new Date().toDateString()
        }], function (err, user) {
            res.status(200).json(user);
        })
    },
    updateUser: function (req, res) {
        var inputUser = req.body;
        console.log(inputUser);
        //console.log('in update user auth') //"59d37e218807b929e829eec0", "admin"
        UserAuth.update({ "_id": inputUser._id }, { $set: { "firstname": inputUser.firstname, "lastname": inputUser.lastname, "contact": inputUser.contact, "email": inputUser.email, "username": inputUser.username, "password": enc.encrypt(config.encryptionKey, inputUser.password), "role": inputUser.role, "isActive": true} }, function (err, docs) {
            //console.log(docs)
            res.status(200).json(docs);
        })
    },
    deleteUser: function (req, res) {
        var inputUser = req.body;
        //console.log('user removed') //"59d37e218807b929e829eec0", "admin"
        UserAuth.remove({ "_id": inputUser._id, "username": inputUser.username }, function (err, user) {
            //console.log("DELETE USER => ");
            //console.log(user)
            res.status(200).json(user);
        })
    },
    getUserPassword: function (req, res) {
        res.status(200).json(enc.decrypt(config.encryptionKey, req.body.password));
    },
    changeUserActivation: function (req, res) {
        var inputUser = req.body;
        //console.log('in update user auth') //"59d37e218807b929e829eec0", "admin"
        UserAuth.update({ "_id": inputUser._id, "username": inputUser.username }, { $set: { "isActive": inputUser.isActive } }, function (err, docs) {
            //console.log(docs)
            res.status(200).json(docs);
        })
    },

    grantRevokeAccess: function (req, res) {
        var inputUser = req.body;
        //console.log('in update user auth') //"59d37e218807b929e829eec0", "admin"
        UserAuth.update({ "_id": inputUser._id, "username": inputUser.username }, { $set: { "role": inputUser.role } }, function (err, docs) {
            //console.log(docs)
            res.status(200).json(docs);
        })
    },
    getSystemUsers: function (req, res) {
        UserAuth.find({ "isActive": true }, function (err, docs) {
            if (err) {
                res.end(err);
            }
            //console.log(docs);
            res.status(200).json(docs)
        })
    },
    changePassword: function (req, res) {
        var inputUser = req.body;
        UserAuth.update({ "username": inputUser.username, "password": inputUser.password }, { $set: { "password": inputUser.newPassword } }, function (err, docs) {
            if (err) {
                res.end(err);
            }
            //console.log(docs)
            res.status(200).json(docs);
        })
    },

    getInactiveUsers: function (req, res) {
        UserAuth.find({ "isActive": false }, function (err, docs) {
            if (err) {
                res.end(err);
            }
            //console.log(docs);
            res.status(200).json(docs);
        })
    },
    resetUserDB: function () {
        UserAuth.remove({}, function (err, docs) {
            console.log(docs);
        });
    }

}