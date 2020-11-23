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

function checkCoachSchedule(id, start, end) { // affectedRow == 0 이면 db에 스켜줄 추가 가능
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

// Candidate
function insertCandidateData(first_date, second_date, third_date, coach_id, item_id, member_name, member_tel, member_email, member_youtube, member_refund_account,member_refund_bank) {
    // 필요한 것 -> 데이터 삽입 ,소요 시간, 비교 대상이 될 조인 테이블, 비교 식
    // 클라이언트에서 spend time 보내주면 좋을듯.
    // 넘어오는 날짜 포맷이 어떻게 되는가?

    // insert Candidate
    let dates = [new Date(first_date),new Date(second_date),new Date(third_date)];
    dates = dates.map(e=>getFormatDate(e));
    const SQL = `INSERT INTO Candidate(first_date,second_date,third_date,coach_id,item_id,member_name,member_tel,member_email,member_youtube,member_refund_account,member_refund_bank)
                 VALUES (\"${dates[0]}\",\"${dates[1]}\",\"${dates[2]}\",\"${coach_id}\",\"${item_id}\",\"${member_name}\",\"${member_tel}\",\"${member_email}\",\"${member_youtube}\",\"${member_refund_account}\",\"${member_refund_bank}\")`;

    return executeSQL(SQL);
}

function getItemTimeSpend(goodsNo) { // item_id가 아닌 item_goods로 변경
    const SQL = `SELECT timespend FROM Item WHERE goodsNo = ${goodsNo}`;
    return executeSQL(SQL);
}
function getItemInfo(goodsNo){
    const SQL = `SELECT * FROM Item WHERE goodsNo = \"${goodsNo}\"`;
    return executeSQL(SQL);
}

function checkScheduleDuplicate(coach_id, item_id, first_date, second_date, third_date, spend_time) {
    // 오는 값은 first second_date third_date coach_id
    // coach_id 랑 payment 조인
    // first, second_date, third_date값 구해놓고 각 리스트에 대해서 범위 안 벗어나는지 체크

    // get timespend using item_id
    let start_time = [new Date(first_date), new Date(second_date), new Date(third_date)]; // 여기에 timespend 더해줄것
    let end_time = [new Date(first_date), new Date(second_date), new Date(third_date)];
    end_time = end_time.map(e => new Date(e.setHours(e.getHours() + parseInt(spend_time))));
    start_time = start_time.map(date=>getFormatDate(date));
    end_time = end_time.map(date=>getFormatDate(date));

    // 중복되는 녀석을 반환
    const SQL = `SELECT *
                  FROM Payment AS p
                  JOIN Item AS i
                  ON i.goodsNo = ${item_id}
                  WHERE p.coach_id = ${coach_id}
                  AND ((p.start_date < \"${end_time[0]}\" AND \"${start_time[0]}\" < DATE_ADD(p.start_date, INTERVAL ${spend_time} HOUR))
                  AND (p.start_date < \"${end_time[1]}\" AND \"${start_time[1]}\" < DATE_ADD(p.start_date, INTERVAL ${spend_time} HOUR))
                  AND (p.start_date < \"${end_time[2]}\" AND \"${start_time[2]}\" < DATE_ADD(p.start_date, INTERVAL ${spend_time} HOUR)))`; // 각 조인 컬럼에 대해서 조건문 탐

    return executeSQL(SQL.replace(/[\n]/g,''));
    //return executeSQL(SQL);
}

function updateCoachInfo(id, name = '', tel = '', email = '') {
    const SQL = `UPDATE Coach SET name=\"${name}\",tel=\"${tel}\",email=\"${email}\" WHERE coach_id=\"${id}\"`;
    return executeSQL(SQL);
}
function getFormatDate(date){
    const year = date.getFullYear();
    let month = (1 + date.getMonth());
    month = month >= 10 ? month : '0' + month;
    let day = date.getDate();
    day = day >= 10 ? day : '0' + day;
    let hour = date.getHours();
    hour = hour >= 10 ? hour : '0' + hour;
    let min = date.getMinutes();
    min = min >= 10 ? min : '0' + min;
    let sec = date.getSeconds();
    sec = sec >= 10 ? sec : '0' + sec;
    return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ":" + sec;
}
function showCandidateList(coach_id){
    const SQL = `SELECT * FROM Candidate WHERE coach_id=\"${coach_id}\"`;
    return executeSQL(SQL);
}
function insertCandidateIntoPayment(id) {

}
module.exports = {
    // sql base
    executeSQL,
    createConnection,

    // coach sql
    insertCoachDataByTel,
    getAllCoachList,
    getCoachInfo,
    deleteCoachInfoByTel,
    getCoachPayments,
    checkCoachSchedule,
    updateCoachInfo,

    // member sql
    getAllMemberList,
    insertMember,
    getMemberInfo,

    // Candidate
    insertCandidateData,
    checkScheduleDuplicate,
    insertCandidateIntoPayment,
    showCandidateList,

    // item
    getItemTimeSpend,
    getItemInfo
};
