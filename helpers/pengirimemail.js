const nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'travelid2019@gmail.com',
        pass: 'mynusokoggwitzht'
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter