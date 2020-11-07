var config = require('./config');
var db = require(config.database.provider);

var options = {};
for (var name in config.database.connection) {
    options[name] = config.database.connection[name];
}
var conn = db.createConnection(options);
conn.connect();

module.exports = conn;