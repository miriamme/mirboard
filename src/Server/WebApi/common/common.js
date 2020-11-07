module.exports = {
    //현재날짜 가저오기 : return value (yyyy-MM-dd HH:mm:ss)
    getDate: function () {
        var date;
        date = new Date();
        date = date.getFullYear() + '-' +
            ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
            ('00' + date.getDate()).slice(-2) + ' ' +
            ('00' + date.getHours()).slice(-2) + ':' +
            ('00' + date.getMinutes()).slice(-2) + ':' +
            ('00' + date.getSeconds()).slice(-2);
        return date;
    }
};