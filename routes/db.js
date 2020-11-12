const express = require('express');
const router = express.Router();
const {
    insertCoachDataByTel, getAllCoachList, deleteCoachInfoByTel, getCoachInfo,
    getAllMemberList, getCoachPayments
} = require("../public/config/database");

router.post('/', (req, res) => {
    // db 접속해서 값을 리턴받아서 화에 뿌려주기
    const {body} = req;
    if (body.choose === "고객") {

    } else if (body.choose === "코치") {
        if (body.name === '' && body.tel === '' && body.mail === '') {
            getAllCoachList().then(data => {
                console.log({data});
                res.status(200).json(data);
            });
        }
    }
    // res.status(200).json({
    //     data: [{
    //         "name": "김대현",
    //         "email": "tommy1003@naver.com",
    //         "tel": "01022294267"
    //     }, {
    //         "name": "크리에이딧",
    //         "email": "creadit2020@gmail.com",
    //         "tel": "01020202020"
    //     }]
    // });
});
router.post("/member", (req, res) => { // member 정보 뿌려주기.
    const {name, tel, email} = req.body;
    if (name === '') {
        getAllMemberList().then(data => {
            res.send(data)
        });
    } else {
        if (tel === '') {
            getCoachInfo(name).then(data => {
                res.send(data);
            });
        } else {
            getCoachInfo(name, tel).then(data => {
                res.send(data);
            });
        }
    }
});
router.post("/coach", (req, res) => { // coach 정보 뿌려주기.
    const tmp = req.body;
    console.log(tmp);
    const {name, tel, email} = req.body;
    if (name === '') {
        getAllCoachList().then(data => {
            res.send(data)
        });
    } else {
        if (tel === '') {
            getCoachInfo(name).then(data => {
                res.send(data);
            });
        } else {
            getCoachInfo(name, tel).then(data => {
                res.send(data);
            });
        }
    }
});
router.post("/coach/payments",(req,res)=>{
    const { id } = req.body;
    console.log('도착, ',id);
    getCoachPayments(id).then(data=>res.send(data));
});
router.post("/coach/register", (req, res) => { // coach 등록.
    const {name, tel} = req.body;
    insertCoachDataByTel(name, tel).then(data => res.send(data));
});
router.post("/coach/delete", (req, res) => { // coach 삭제.
    const {name, tel} = req.body;
    deleteCoachInfoByTel(name, tel).then(data => res.send(data));
});
router.get('/register', (req, res) => { // coach 등록/삭제 화면
    res.status(200).render('register.html');
});

module.exports = router;