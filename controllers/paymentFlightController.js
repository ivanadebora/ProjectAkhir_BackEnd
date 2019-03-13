const moment = require('moment')
const conn = require('../database')
const fs = require('fs');
const transporter = require('../helpers/pengirimemail');

module.exports = {
    paymentgettrans: (req,res) => {
        var sql = `select * from flight_transaction order by tanggal_konfirmasi desc;`;
        conn.query(sql, (err,results) => {
            if (err) throw err;
            res.send(results)
        })
    },
    editpaymentstatus: (req,res) => {
        var sql = `update flight_transaction set status_transaksi='${req.body.status_transaksi}' where id=${req.params.id};`;
        conn.query(sql, (err,results) => {
            if (err) throw err;
            var sql = `select * from flight_transaction order by tanggal_konfirmasi desc;`;
            conn.query(sql, (err1, results1) => {
                if (err1) throw err1;
                res.send(results1)
            })
        })
    },
    acceptedmailsend: (req,res) => {
        var sql = `select * from flight_transaction where id = ${req.params.id};`;
        conn.query(sql, (err,results) => {
            if (err) throw err;
            console.log(results)
            var kode_booking = results[0].kode_booking
            var username = results[0].username
            var nama = results[0].nama
            var tanggal = results[0].tanggal
            var transaction_id = results[0].id
            var code = results[0].code
            var departure_city = results[0].departure_city
            var arrival_city = results[0].arrival_city
            
            sql = `select passenger1, passenger2, passenger3, passenger4, passenger5
                    from flight_passenger where id_transaksi=${transaction_id};`
            conn.query(sql, (err1, results1) => {
                if (err1) throw err1;
                console.log(results1)
                if(results1[0].passenger1 !== null && results1[0].passenger2 === null && results1[0].passenger3 === null && results1[0].passenger4 === null && results1[0].passenger5 === null){
                    var passenger1 = results1[0].passenger1
                    var passenger2 = ''
                    var passenger3 = ''
                    var passenger4 = ''
                    var passenger5 = ''
                }
                else if(results1[0].passenger1 !== null && results1[0].passenger2 !== null && results1[0].passenger3 === null && results1[0].passenger4 === null && results1[0].passenger5 === null){
                    var passenger1 = results1[0].passenger1
                    var passenger2 = results1[0].passenger2
                    var passenger3 = ''
                    var passenger4 = ''
                    var passenger5 = ''
                }
                else if(results1[0].passenger1 !== null && results1[0].passenger2 !== null && results1[0].passenger3 !== null && results1[0].passenger4 === null && results1[0].passenger5 === null){
                    var passenger1 = results1[0].passenger1
                    var passenger2 = results1[0].passenger2
                    var passenger3 = results1[0].passenger3
                    var passenger4 = ''
                    var passenger5 = ''
                }
                else if(results1[0].passenger1 !== null && results1[0].passenger2 !== null && results1[0].passenger3 !== null && results1[0].passenger4 !== null && results1[0].passenger5 === null){
                    var passenger1 = results1[0].passenger1
                    var passenger2 = results1[0].passenger2
                    var passenger3 = results1[0].passenger3
                    var passenger4 = results1[0].passenger4
                    var passenger5 = ''
                }
                else {
                    var passenger1 = results1[0].passenger1
                    var passenger2 = results1[0].passenger2
                    var passenger3 = results1[0].passenger3
                    var passenger4 = results1[0].passenger4
                    var passenger5 = results1[0].passenger5
                }

                sql = `select email from user where username='${username}';`
                conn.query(sql, (err2,results2) => {
                    if (err2) throw err2;
                    console.log(results2)
                    var email = results2[0].email
                    var mailOption = {
                        from: 'TravelID <travelid2019@gmail.com>',
                        to: email,
                        subject: `Flight E-Ticket Payment Successful! Booking ID ${kode_booking}`,
                        html: `<center><h1>Your e-ticket is here!</h1></center>
                                <br/><br/>
                                <p><b>Dear ${username},</b></p>
                                <p>Your flight reservation has been successfully confirmed.</p>
                                <br/>
                                <h3>Your Flight Details:</h3>
                                <hr />
                                <p>Booking ID: ${kode_booking}</p>
                                <p>${nama} (${code})</p>
                                <p>${moment(tanggal).format('dddd, DD MMMM YYYY')}</p>
                                <p>from <b>${departure_city}</b> to <b>${arrival_city}</b></p> <br/>
                                <p><b>Passenger(s):</b></p>
                                <p>${passenger1}<p>
                                <p>${passenger2}<p>
                                <p>${passenger3}<p>
                                <p>${passenger4}<p>
                                <p>${passenger5}<p>
                                <hr />
                                <p>Thank you for using our services! Enjoy your travel with TravelID</p>`
                    }
                    transporter.sendMail(mailOption, (err3, results3) => {
                        if(err3) {
                            console.log(er3)
                            throw err3
                        }
                        else {
                            res.send('Send Mail Success!')
                            console.log(results3)
                            console.log('Send Mail Success!')
                        }
                    })
                })
            })
        })
    },
    deniedmailsend: (req,res) => {
        var sql = `select * from flight_transaction where id = ${req.params.id};`;
        conn.query(sql, (err,results) => {
            if (err) throw err;
            console.log(results)
            var kode_booking = results[0].kode_booking
            var username = results[0].username
            var nama = results[0].nama
            var tanggal = results[0].tanggal
            var code = results[0].code
            var departure_city = results[0].departure_city
            var arrival_city = results[0].arrival_city

            sql = `select email from user where username='${username}';`
            conn.query(sql, (err2,results2) => {
                if (err2) throw err2;
                console.log(results2)
                var email = results2[0].email
                var mailOption = {
                    from: 'TravelID <travelid2019@gmail.com>',
                    to: email,
                    subject: `Flight E-Ticket Payment Failed! Booking ID ${kode_booking}`,
                    html: `<center><h1>Your e-ticket is failed to be confirmed!</h1></center>
                            <br/><br/>
                            <p><b>Dear ${username},</b></p>
                            <p>We're sorry to inform you that your flight reservation with Booking ID ${kode_booking} has been denied.</p>
                            <br/>
                            <h3>Your Flight Details:</h3>
                            <hr />
                            <p>Booking ID: ${kode_booking}</p>
                            <p>${nama} (${code})</p>
                            <p>${moment(tanggal).format('dddd, DD MMMM YYYY')}</p>
                            <p>from <b>${departure_city}</b> to <b>${arrival_city}</b></p>
                            <hr />
                            <p>Please call 0812-1200-703 for your payment resubmission condition process!</p>`
                }
                transporter.sendMail(mailOption, (err3, results3) => {
                    if(err3) {
                        console.log(er3)
                        throw err3
                    }
                    else {
                        res.send('Send Mail Success!')
                        console.log(results3)
                        console.log('Send Mail Success!')
                    }
                })
            })
        })
    },
    stockupdate: (req,res) => {
        var sql = `select flight_productId, qty from flight_transaction where id = ${req.params.id};`
        conn.query(sql, (err,results) => {
            if(err) throw err;
            var productId = results[0].flight_productId
            var jumlah_penumpang = results[0].qty

            sql = `select jumlah_seat from flight_product where id = ${productId};`
            conn.query(sql, (err1, results1) => {
                if (err1) throw err1;
                var stock = results1[0].jumlah_seat
                var stockUpdate = stock + jumlah_penumpang
                sql = `update flight_product set jumlah_seat = ${stockUpdate} where id = ${productId};`
                conn.query(sql, (err2, results2) => {
                    if (err2) throw err2;
                    console.log(results2)
                    console.log('Success updating stock!')
                    res.send('Success updating stock!')
                })
            })
        })
    },
    countacceptedtrans: (req,res) => {
        var sql = `select count(*) as hasil from flight_transaction where status_transaksi = 'Pembayaran Berhasil';`
        conn.query(sql, (err,results) => {
            if (err) throw err;
            res.send(results)
        })
    },
    countdeniedtrans: (req,res) => {
        var sql = `select count(*) as hasil from flight_transaction where status_transaksi = 'Pembayaran Ditolak';`
        conn.query(sql, (err,results) => {
            if (err) throw err;
            res.send(results)
        })
    },
    countwaitingtrans: (req,res) => {
        var sql = `select count(*) as hasil from flight_transaction where status_transaksi = 'Menunggu Persetujuan Pembayaran';`
        conn.query(sql, (err,results) => {
            if (err) throw err;
            res.send(results)
        })
    },
    countalltrans: (req,res) => {
        var sql = `select count(*) as hasil from flight_transaction;`
        conn.query(sql, (err,results) => {
            if (err) throw err;
            res.send(results)
        })
    }
}