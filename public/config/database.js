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
function insertMember(name, tel, email = '') { // 생년월일도 추가하면 좋을듯
    const SQL = `INSERT IGNORE INTO Member (name,email,tel) values(\"${name}\",\"${email}\",\"${tel}\")`;
    return executeSQL(SQL);
}

function getAllMemberList() {
    const SQL = `SELECT * FROM Member`;
    return executeSQL(SQL);
}

function getMemberInfo(name, tel = '', email = '') {
    let SQL;
    if (tel === '' && email === '') {
        SQL = `SELECT * FROM Member WHERE name=\"${name}\"`;
    } else if (email === '') {
        SQL = `SELECT * FROM Member WHERE name=\"${name}\" AND tel=\"${tel}\"`;
    } else if (tel === '') {
        SQL = `SELECT * FROM Member WHERE name=\"${name}\" AND tel=\"${email}\"`;
    }
    return executeSQL(SQL);
}

// coach sql
// function getCoachSchedule(name,title){
//     // const SQL = `SELECT * from Payment where `
// }
function insertCoachDataByTel(name, tel, email = '') {
    const SQL = `INSERT IGNORE INTO Coach (name,email,tel) values(\"${name}\",\"${email}\",\"${tel}\")`;
    return executeSQL(SQL);
}

function getCoachInfo(name, tel = '', email = '') {
    let SQL;
    if (tel === '' && email === '') {
        SQL = `SELECT * FROM Coach WHERE name=\"${name}\"`;
    } else if (email === '') {
        SQL = `SELECT * FROM Coach WHERE name=\"${name}\" AND tel=\"${tel}\"`;
    } else if (tel === '') {
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

function getCoachPayments(id) {
    const SQL =
        `SELECT *
        FROM Payment p
        WHERE p.coach_id=${id}`;
    return executeSQL(SQL);
}
function checkCoachSchedule(id,start,end){ // affectedRow == 0 이면 db에 스켜줄 추가 가능
    const SQL =
    // 중복이 아닌 녀석들을 출력해준다.
    //     `SELECT *
    //     FROM Payment
    //     WHERE start_date >= ${end}
    //     OR ${start} >= end_date`;

    // 중복인 녀석들을 출력해준다.
        `SELECT *
        FROM Payment
        WHERE coach_id=${id}
        AND start_date < ${end}
        AND ${start} < end_date`;
    return executeSQL(SQL);
}
function updateCoachInfo(id,name='',tel='',email=''){
    const SQL = `UPDATE Coach SET name=\"${name}\",tel=\"${tel}\",email=\"${email}\" WHERE coach_id=\"${id}\"`;
    return executeSQL(SQL);
}

module.exports = {
    // sql base
    executeSQL, createConnection,

    // coach sql
    insertCoachDataByTel, getAllCoachList, getCoachInfo, deleteCoachInfoByTel, getCoachPayments,checkCoachSchedule,updateCoachInfo,

    // member sql
    getAllMemberList, insertMember, getMemberInfo,

};
