var formidable = require('formidable');
var fs = require('fs');
var http = require('http');
var FormData = require('form-data');
var request = require('request');
var config = require('../config')
var unzip = require('unzip');
require('mongoose').model('colorshades');
var mongoose = require('mongoose');
var colorshade = mongoose.model('colorshades');
var db = require('../routes/db');

var iter = 0;

module.exports = {

    uploadFile: function (req, res) {

        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            iter++;
            console.log("file upload api called " + iter + " time")
            // rename and move uploaded file
            var oldpath = files.filetoupload.path;
            console.log(oldpath);
            var newpath = files.filetoupload.path.substring(0, files.filetoupload.path.lastIndexOf('\\'))
            newpath += "\\" + files.filetoupload.name;
            console.log(newpath);
            var formData = {};
            fs.rename(oldpath, newpath, function (err) {
                console.log('File uploaded and moved!');
                console.log('creating read stream')
                formData = {
                    file: fs.createReadStream(newpath),
                    filename: files.filetoupload.name,
                    username: fields.username
                };

                request.post({ url: config.flask.endpoint + '/api/Upload', formData: formData }, function optionalCallback(err, httpResponse, body) {
                    if (err) {
                        return console.error('upload failed:', err);
                    }
                    res.end(body)
                });
            });
        })
    },

    ImageUpload: function (req, res) {
        //console.log("req.body.Sprint_Id_ => ")
        //console.log(req.body.Sprint_Id)
        //console.log(req.body.ImageStr)

        require("fs").writeFile("public/shades/sprint_images/" + req.body.Sprint_Id + ".jpg", req.body.ImageStr, 'base64', function (err) {
            console.log(err);
        });
    },

    uploadZip: function (req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            // rename and move uploaded file
            var oldpath = files.filetoupload.path;
            console.log(oldpath);
            var newpath = files.filetoupload.path.substring(0, files.filetoupload.path.lastIndexOf('\\'))
            newpath += "\\" + files.filetoupload.name;
            console.log(newpath);
            var formData = {};
            fs.rename(oldpath, newpath, function (err) {
                //console.log('File uploaded and moved!');
                //console.log('creating read stream');
                fs.createReadStream(newpath).pipe(unzip.Extract({ path: 'public' }));
                var newfolder = files.filetoupload.name.split(".")[0];
                setTimeout(function () {
                    fs.readdir("public/" + newfolder + "/", (err, files) => {
                        files.forEach(file => {
                            var fileName = file.split(".")[0];
                            var sprintID = 0;
                            if (fileName.length > 0) {
                                colorshade.findOne({ Formula_Number: fileName }, { "Sprint_Id": 1, "_id": 0 }, function (err, docs) {
                                    if (err) {
                                        res.status(504);
                                        console.log("ERROR");
                                        res.end(err);
                                    } else {
                                        var array = JSON.parse("[" + JSON.stringify(docs) + "]");
                                        if (array != null) {
                                            sprintID = array[0].Sprint_Id;
                                            //console.log("SPRINT : " + sprintID);
                                            if (sprintID != 0 && sprintID != null) {
                                                fs.rename("public/" + newfolder + "/" + file, "public/shades/sprint_images/" + sprintID + ".jpg", function (err) {
                                                    if (err) {
                                                        return console.error('upload failed:', err);
                                                    }
                                                    res.end('Success')
                                                })
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    })
                }, 2000);
            });
        })
    }
}