var result = require('./result');

class BoardMaster {
    constructor(code, message) {
        result.call(this, code, message);

        this.single = {};
        this.list = [];
    }
}

module.exports = BoardMaster;