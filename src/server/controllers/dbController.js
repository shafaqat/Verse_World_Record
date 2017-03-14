import mysql from 'mysql';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'verseDB'
});

const connect = function() {
    connection.connect(function(err) {
        if (err) throw err;
        console.log('You are now connected...')
    });
};

export default {
    connection: connection,
    connect: connect
};