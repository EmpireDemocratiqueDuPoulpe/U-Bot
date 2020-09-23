const MySQL = require('mysql2/promise');
const config = require('./config.json');

/****************************
 * OPEN DATABASE CONNECTION
 ****************************/

/*const database = MySQL.createConnection({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
    charset: config.database.charset
});

database.connect(function (e) {
    if (e) throw e;
    console.log('Connected to database.');
});

module.exports = database;*/




let _pool;

module.exports = {
    connect: function () {
        _pool = MySQL.createPool({
            host: config.database.host,
            port: config.database.port,
            user: config.database.user,
            password: config.database.password,
            database: config.database.name,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log('Connected to database.');

        //_database.connect(function (err) {
        //    if (err) throw err;
        //    console.log('Connected to database.');
        //});
    },

    get: function () {
        return _pool;
    },
}