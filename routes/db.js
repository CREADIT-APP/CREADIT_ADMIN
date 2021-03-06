const express = require('express');
const router = express.Router();
const {
    //coach
    insertCoachDataByTel, getAllCoachList, deleteCoachInfoByTel, getCoachInfo, getCoachPayments,updateCoachInfo,

    //member
    getAllMemberList, insertMember,

    //candidate
    showCandidateList
} = require("../public/config/database");

router.post('/', (req, res) => {
    // db 접속해서 값을 리턴받아서 화에 뿌려주기
    const {choose,name,tel,mail} = req.body;
    if (choose === "고객") {

    } else if (choose === "코치") {
        if (name === '' && tel === '' && email === '') {
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
router.post("/member/register", (req, res) => {
    const {name, tel, email} = req.body;
    insertMember(name,tel,email).then(data=>res.send(data));
});
router.post("/coach", (req, res) => { // coach 정보 뿌려주기.
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
router.post("/coach/payments", (req, res) => {
    const {id} = req.body;
    getCoachPayments(id).then(data => res.send(data));
});
router.post("/coach/register", (req, res) => { // coach 등록.
    const {name, tel} = req.body;
    insertCoachDataByTel(name, tel).then(data => res.send(data));
});
router.post("/coach/update",(req,res)=>{
    const {coach_id,name,tel,email} = req.body;
    updateCoachInfo(coach_id,name,tel,email).then(data=>{console.log(data);res.send(data)});
})
router.post("/coach/delete", (req, res) => { // coach 삭제.
    const {name, tel} = req.body;
    deleteCoachInfoByTel(name, tel).then(data => res.send(data));
});

router.post("/candidate",(req,res)=>{
    const {coach_id} = req.body;
    showCandidateList(coach_id).then(data=>{res.status(200).send(data)});
});
router.post("/candidate/register",(req,res)=>{
   const {id} = req.body;

});
router.get('/register', (req, res) => { // coach 등록/삭제 화면
    res.status(200).render('register.html');
});

module.exports = router;