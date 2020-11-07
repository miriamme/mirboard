
module.exports = {
    server : {
        port: 30000,
        domain: 'localhost'
    },
    database : {
        provider: "mysql",
        connection: {
            host: 'localhost',
            post: 3306,
            user: 'root',
            password: '******',
            database: 'mirboard',
            multipleStatements: true
        }
    },
    router : {
        board: 'board',
        master: 'boardmaster',
        user: 'user'
    },
    log : {
        dirName: 'log',
        logdirFormat: 'yyyy-MM-dd'
    },
    auth : {
        loginKey : "SeCrEtKeYfOrHaShInG"
    }
};
