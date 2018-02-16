var express = require('express');
var session = require('express-session');
var path = require('path');
var fs = require('fs');
var morgan = require('morgan');
var rfs = require('rotating-file-stream');
var config = require('./config')
var db = require('./routes/db');
var user = require('./routes/user');
var fileupload = require('./routes/fileupload');
var auth = require('./routes/auth');
var analytics = require('./routes/analytics');
var common = require('./routes/common');
var mongoose = require('mongoose');
var enc = require('./routes/encryption');

var app = express();
var logDirectory = path.join(__dirname, 'log')

const bodyParser = require('body-parser');
const responseSize = require('response-size');


app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.use(responseSize({ threshold: 99999999999, enable: true }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));

var UserAuth = mongoose.model('userAuthorization');

var sess;
var userData = [];
// ensure log directory exists 
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream 
var accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily 
    path: logDirectory
})

// setup the logger 
app.use(morgan('combined', { stream: accessLogStream }))

// views section
app.get('/', (req, res) => {
    sess = req.session;
    //console.log("sess.username => " + sess.username);
    if (sess.username) {
        res.sendFile(__dirname + '/views/index.html');
    }
    else {
        res.sendFile(__dirname + '/views/login.html');
    }
})

app.get('/login', (req, res) => {
    sess = req.session;
    sess.username = req.body.username;
    res.sendFile(__dirname + '/views/login.html');
})

app.post('/login', (req, res) => {
    UserAuth.findOne({ "username": req.body.username, "password": enc.encrypt(config.encryptionKey, req.body.password), "isActive": true }, function (err, user) {
        userData.push(req.body.username);
        sess = req.session;
        if (user != null) {
            sess.username = user._id;
        }
        res.status(200).json(user);
    });
})

app.get('/loginUserDetails', (req, res) => {
    //console.log("/loginUserDetails => " + sess.username);
    sess = req.session;
    if (sess.username) {
        UserAuth.findOne({ "_id": sess.username }, function (err, user) {
            userData.push(req.body.username);
            sess = req.session;
            sess.username = user._id;
            res.status(200).json(user);
        });
    }
    else {
        res.sendFile(__dirname + '/views/login.html');
    }
})

app.get('/data', (req, res) => {
    res.sendFile(__dirname + '/views/data.html');
})

// api section
app.post('/colorshade', user.createUsers);
app.get('/colorshade/:page', user.seeResults);
app.get('/colorshade/:_id', user.seeResult);
app.post('/colorshade/range', user.getRange);
app.post('/colorshade/fullData', user.getFullData);
app.delete('/colorshade/:id', user.delete);
app.delete('/colorshade/revertUpload/:Added_On', user.revertUpload);
app.put('/colorshade/', user.update);
app.post('/fileupload', fileupload.uploadFile);
app.post('/analytics/clusters', analytics.getClusters);
app.post('/analytics/nearestFormula', analytics.getNearestFormula);
app.get('/statistics', user.statistics);
//revertUpload
app.get('/defaultBindValues', common.getBindValues);
app.get('/getFibreTypes', common.getTypeOfFibres);
app.get('/getLogs/:userid', common.getUserLogs);
//app.post('/login', auth.login);
//user management apis
app.post('/addUser', auth.addUser);
app.post('/getPassword', auth.getUserPassword);
app.post('/updateUser', auth.updateUser);
app.post('/deleteUser', auth.deleteUser);
app.post('/grantRevokeAccess', auth.grantRevokeAccess);
app.post('/changeUserActivation', auth.changeUserActivation);
app.post('/changePassword', auth.changePassword);
app.get('/getSystemUsers', auth.getSystemUsers);
app.get('/getInactiveUsers', auth.getInactiveUsers);
app.post('/fUploadTrial', fileupload.uploadZip);

app.listen(config.port, function () {
    //console.log(ObjectId.ObjectID('599152f5955dbfbf5a2bc37b'))    
    //user.resetCounter('userid')
    //user.testRes(1)
    //common.resetUserLogs()

    //auth.resetUserDB();
    console.log('Example app listening on port 3010!');
}); 