var result = require('./result');

class Board {
    constructor(code, message) {
        result.call(this, code, message);

        this.single = {};
        this.list = [];
    }
}

module.exports = Board;