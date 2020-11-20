const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');
const {insertCandidateData, checkScheduleDuplicate, getItemInfo, getItemTimeSpend} = require('./public/config/database');

app.use(cors);
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.listen(3000, () => {
    console.log('server is running on port 3000');
});

app.post('/data/submit', (req, res, next) => {
    const {body: {first_from_date, second_from_date, third_from_date, coach_id, goodsNo, orderName, orderCellPhone, orderYoutubeLink, orderEmail, orderRefundAccount, orderRefundBank}} = req;

    getItemTimeSpend(goodsNo)
        .then(spend_time => {
            return checkScheduleDuplicate(coach_id, goodsNo, first_from_date, second_from_date, third_from_date, spend_time[0]["timespend"]);
        })
        .then(result => {
            console.log({result});
            //만약 select된 row가 0 일 경우 중복된게 없다는 뜻.
            if (result.length===0) {
                return getItemInfo(goodsNo)
                    .then(result => {
                        const item_id = result[0]["item_id"];
                        console.log({first_from_date,second_from_date,third_from_date});
                        return insertCandidateData(first_from_date, second_from_date, third_from_date, coach_id, item_id, orderName, orderCellPhone, orderEmail, orderYoutubeLink, orderRefundAccount, orderRefundBank)
                    });
            } else { // 중복일 경우
                res.status(200).json({message: "tuple_duplicate"});
            }
        })
        .then(result => {
            // 성공적으로 insert한 경우
            console.log({result});
            if (result === undefined) {
                return res.status(200).json({message: "sql insert fail"});
            } else if (result['affectedRows'] == 0) {
                return res.status(200).json({message: "sql insert success"});
            }
        })
        .catch(e => {
            console.log(e);
            next();
        });
});
app.get('/item', (req, res) => {
    const goodsNo = req.query.goodsNo;
    // const {body:{goodsNo}} = req;
    getItemInfo(goodsNo).then(data => {
        console.log(data);
        res.status(200)
            .json({timespend: `${data[0]["timespend"]}`, coach_id: `${data[0]["coach_id"]}`});
    });
});
app.get('/', (req, res) => {
    res.status(200);
    res.render('./main.html');
});
app.use('/db', require('./routes/db'));

// error handling
app.get('*', (req, res) => {
    console.log('404 err');
    res.status(404).render('./error.html');
})
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(404).send('something broke!');
});
