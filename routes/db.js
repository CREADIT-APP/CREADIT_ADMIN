const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    // db 접속해서 값을 리턴받아서 화에 뿌려주기
    res.status(200).json({
        data: [{
            "name": "김대현",
            "email": "tommy1003@naver.com",
            "tel": "01022294267"
        }, {
            "name": "크리에이딧",
            "email": "creadit2020@gmail.com",
            "tel": "01020202020"
        }]
    });
});
router.get('/register',(req,res)=>{
    res.status(200).render('register.html');
});

module.exports = router;