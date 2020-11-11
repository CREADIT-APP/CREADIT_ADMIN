const mysql = require('mysql');
require('dotenv').config();

function createConnection() {
    const {
        DB_HOST: host,
        DB_PORT: port,
        DB_USERNAME: user,
        DB_PW: password,
        DB_DATABASE: database
    } = process.env;

    return mysql.createConnection({host, user, password, port, database});
};

function executeSQL(sql) {
    const connection = createConnection();
    connection.connect();

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
            connection.end();
        });
    });
}

// member sql
function getAllMemberList() {
    const SQL = `SELECT * FROM Member`;
    return executeSQL(SQL);
}

function getMemberInfo(name, tel = 'null', email = 'null') {
    let SQL;
    if (tel === 'null' && email === 'null') {
        SQL = `SELECT * FROM Member WHERE name=\"${name}\"`;
    } else if (email === 'null') {
        SQL = `SELECT * FROM Member WHERE name=\"${name}\" AND tel=\"${tel}\"`;
    } else if (tel === 'null') {
        SQL = `SELECT * FROM Member WHERE name=\"${name}\" AND tel=\"${email}\"`;
    }
    return executeSQL(SQL);
}

// coach sql
function insertCoachDataByTel(name, tel, email = 'null') {
    console.log({name, email, tel});
    const SQL = `INSERT IGNORE INTO Coach (name,email,tel) values(\"${name}\",\"${email}\",\"${tel}\")`;
    return executeSQL(SQL);
}

function getCoachInfo(name, tel = 'null', email = 'null') {
    let SQL;
    if (tel === 'null' && email === 'null') {
        SQL = `SELECT * FROM Coach WHERE name=\"${name}\"`;
    } else if (email === 'null') {
        SQL = `SELECT * FROM Coach WHERE name=\"${name}\" AND tel=\"${tel}\"`;
    } else if (tel === 'null') {
        SQL = `SELECT * FROM Coach WHERE name=\"${name}\" AND tel=\"${email}\"`;
    }
    return executeSQL(SQL);
}

function getAllCoachList() {
    const SQL = `SELECT * FROM Coach`;
    return executeSQL(SQL);
}

function deleteCoachInfoByTel(name, tel) {
    const SQL = `DELETE FROM Coach WHERE name=\"${name}\" AND tel=\"${tel}\"`;
    return executeSQL(SQL);
}


module.exports = {
    // sql base
    executeSQL, createConnection,

    // coach sql
    insertCoachDataByTel, getAllCoachList, getCoachInfo, deleteCoachInfoByTel,

    // member sql
    getAllMemberList, getMemberInfo
};
