const express = require('express');
const app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.listen(3000, () => {
    console.log('server is running on port 3000');
});

app.get('/', (req, res) => {
    res.status(200);
    res.render('./main.html');
});
app.post('/db', (req, res) => {
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