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
app.use('/db',require('./routes/db'));
app.get('*',(req,res)=>{
    console.log('404 err');
    res.status(404).render('./error.html');
})
app.use(function(err,req,res,next){
    console.log(err);
    res.status(404).send('something broke!');
});
