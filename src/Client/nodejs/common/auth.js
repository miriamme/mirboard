var config = require('../config');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');

module.exports = {
    login: function(req, res, token) {
        if (token) {
            jwt.verify(token, config.auth.loginKey, function(err, decoded) {
                if (!err) {
                    req.session.token = token;
                    req.session.userid = decoded.userid;
                    req.app.locals._g.session = req.session;
                }
            });
        }
    },
    logout: function(req, res) {
        req.session = null;
        req.app.locals._g.session = null;
    },
    loginCheck: function(req, res, next) {
        var exceptUrl = config.auth.exceptUrl;
        var url = req.path.toLowerCase();

        if (typeof exceptUrl === "object" && exceptUrl != null && exceptUrl.length > 0) {
            var idx = exceptUrl.findIndex(function(v) {
                return v === url;
            });
            if (idx === -1) {
                //인증체크
                var token = req.session.token ? req.session.token : "";
                var userid = req.session.userid ? req.session.userid : "";
                req.app.locals._g.session = null;
                if (token === "" || userid === "")
                    res.redirect('/user/login?returnurl=' + url);
                else {
                    if (token) {
                        jwt.verify(token, config.auth.loginKey, function(err, decoded) {
                            if (userid === decoded.userid) {
                                req.app.locals._g.session = req.session;
                                next();
                            } else res.redirect('/user/login?returnurl=' + url);
                        });
                    } else
                        res.redirect('/user/login?returnurl=' + url);
                }
            } else
                next();
        } else {
            next();
        }
    },
    encryptPassword: function(password) {
        //password 암호화
        return crypto.createHmac('sha1', config.auth.passwordKey).update(password).digest('base64');
    }
};