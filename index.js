const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Crypto = require('crypto');


const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static('public'))

const port = process.env.PORT || 1212;


app.get('/', (req,res) => {
    res.send('<h1>Selamat Datang di API!</h1>')
})


app.get('/passwordencrypt', (req,res) => {
    var hashPassword = Crypto.createHmac('sha256', 'abc123').update(req.query.password).digest('hex');
    console.log(hashPassword)
    res.send(`Password anda ${req.query.password} di encrypt menjadi ${hashPassword}`)
})

var { 
    authRouter,
    flightRouter,
    productFlightRouter
} = require('./routers')
app.use('/auth', authRouter)
app.use('/flight', flightRouter)
app.use('/admin/flight/product', productFlightRouter)


app.listen(port, () => console.log('API aktif di port ' + port))

