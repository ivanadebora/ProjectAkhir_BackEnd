var express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const Crypto = require('crypto');


var app = express();
app.use(cors())
app.use(bodyParser.json())

var port = process.env.PORT || 1212;

app.get('/', (req,res) => {
    res.send('<h1>Selamat Datang di API!</h1>')
})


app.get('/passwordencrypt', (req,res) => {
    var hashPassword = Crypto.createHmac('sha256', 'abc123').update(req.query.password).digest('hex');
    console.log(hashPassword)
    res.send(`Password anda ${req.query.password} di encrypt menjadi ${hashPassword}`)
})

var { authRouter } = require('./routers')
app.use('/auth', authRouter)


app.listen(port, () => console.log('API aktif di port ' + port))

