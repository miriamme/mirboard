var result = require('./result');

var User = function (code, message) {
    result.call(this, code, message);
    this.single = {};
    this.list = [];
};

User.prototype = new result();
User.prototype.constructor = User;

module.exports = User;