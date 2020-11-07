module.exports = {
    server: {
        port: 31000,
        domain: 'localhost'
    },
    //데이터베이스
    database: {
        provider: "mysql",
        connection: {
            host: 'localhost',
            post: 3306,
            user: 'root',
            password: '******',
            database: 'mirboard'
        }
    },
    //log
    log: {
        pathname: 'log'
    },
    //server webapi url
    endPoint: {
        host: "http://localhost:30000",
        boardInsert: "/board/add",
        boardUpdate: "/board/update",
        boardDelete: "/board/delete",
        boardList: "/board",
        boardMaster: "/boardmaster",
        login: "/user/login",
        register: "/user/register"
    },

    auth: {
        loginKey: "SeCrEtKeYfOrHaShInG",
        passwordKey: "oEt*dfs!@dklLm",
        sessionSecret: "oiu(99)7eE!2T",
        exceptUrl: ["/", "/main", "/user/login", "/user/register"]
    }
};