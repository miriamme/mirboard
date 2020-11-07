//winston 최신버전 3.0.0-rc2 구현 방법은 아래 참조
//https://github.com/winstonjs/winston#creating-your-own-logger

var config = require('../config');
var winston = require('winston');
const fs = require('fs');
const logDir = config.log.dirName;

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();

module.exports = new(winston.Logger)({
    transports: [
        // new(winston.transports.Console)({
        //     timestamp: tsFormat,
        //     colorize: true,
        //     level: 'info'
        // }),
        new(require('winston-daily-rotate-file'))({
            level: 'info',
            filename: `${logDir}/-api.log`,
            timestamp: tsFormat,
            datePattern: config.log.logdirFormat,
            prepend: true,
            json: false
        })
    ]
});