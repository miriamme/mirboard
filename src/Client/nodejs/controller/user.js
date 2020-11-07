var express = require('express');
var config = require('../config');
var server = require('../common/server');
var common = require('../common/common');
var auth = require('../common/auth');
var router = express.Router();
var conn = require('../db');

//----Model Declear-------------------------------------
var model = {
    result: require('../models/result'),
    user: require('../models/user')
};
//----Model Declear-------------------------------------

//가입
router.get('/register', function(req, res) {
    res.render('register.ejs', {
        message: "",
        userid: ""
    });
});
router.post('/register', function(req, res) {
    var reqData = {
        userid: req.body.userid,
        password: req.body.password
    };
    var passwordConfirm = req.body.password_confirmation;
    if (reqData.password !== passwordConfirm) {
        res.render('register.ejs', {
            message: "The Password is different below a Confirm Password.",
            userid: reqData.userid
        });
    } else {
        //password 암호화
        reqData.password = auth.encryptPassword(reqData.password);

        server.apiCall(config.endPoint.register, "POST", reqData, function(data) {
            if (data.resultCode === 0) {
                res.render('login.ejs', {
                    message: data.resultMessage,
                    returnUrl: ""
                });
            } else {
                res.render('register.ejs', {
                    message: data.resultMessage,
                    userid: reqData.userid
                });
            }
        });
    }
});

//login
router.get('/login', function(req, res) {
    res.render('login.ejs', {
        message: "",
        returnUrl: req.query.returnurl
    });
});
router.post('/login', function(req, res) {
    var returnUrl = req.query.returnurl ? req.query.returnurl : "";
    var reqData = {
        userid: req.body.userid,
        password: auth.encryptPassword(req.body.password)
    };

    server.apiCall(config.endPoint.login, "POST", reqData, function(data) {
        if (data.resultCode === 0) {
            auth.login(req, res, data.resultMessage);
            console.log("returnUrl : ", returnUrl);
            if (returnUrl !== "undefined" && returnUrl !== "")
                res.redirect(returnUrl);
            else
                res.redirect('/');
        } else {
            res.render('login.ejs', {
                message: data.resultMessage,
                returnUrl: req.query.returnurl
            });
        }
    });
});

//logout
router.get('/logout', function(req, res) {
    auth.logout(req, res);
    res.redirect('/user/login');
});


module.exports = router;