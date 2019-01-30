const Crypto = require('crypto');
const conn = require('../database');
const transporter = require('../helpers/pengirimemail');



module.exports = {
    register: (req,res) => {
        var {username, password, email, phone} = req.body;
        var sql = `select username from user where username='${username}'`
        conn.query(sql, (err,results) => {
            if(err){
                throw err
            }
            if(results.length > 0){
                res.send({status: 'error', message: 'Username has been taken!'})
            }
            else {
                var hashPassword = Crypto.createHmac('sha256', 'abc123').update(password).digest('hex');
                var dataUser = {
                    username,
                    password: hashPassword,
                    email,
                    phone,
                    role: 'User',
                    status: 'Unverified',
                    lastlogin: new Date()
                }
                sql = `insert into user set ?`;
                conn.query(sql, dataUser, (err1, res1) => {
                    if(err1) {
                        throw err1
                    }
                    var linkverifikasi = `http://localhost:3000/verified?username=${username}&password=${hashPassword}`;
                    var mailOption = {
                        from: 'TravelID <travelid2019@gmail.com>',
                        to: email,
                        subject: 'Verifikasi Email',
                        html: `Hi ${username}, 
                        Your user account with the e-mail address ${email} has been created. 
                        <br/>
                        Please follow the link below to activate your account.  : <a href="${linkverifikasi}">Click here!</a>`
                    }
                    transporter.sendMail(mailOption, (err2, res2) => {
                        if(err2) {
                            console.log(err2)
                            throw err2
                        }
                        else {
                            res.send('Success')
                            res.send({username, email, role:'User', status:'Unverified'})
                        }
                    })
                })
            }
        })
    },
    signin: (req,res) => {

    },
    verified: (req,res) => {
        var { username, password } = req.body;
        var sql = `select * from user where username='${username}' and password='${password}'`;
        conn.query(sql, (err,results)=> {
            if(err) throw err;

            if(results.length > 0){
                sql = `update user set status='Verified' where id=${results[0].id}`;
                conn.query(sql, (err1,res1) => {
                    if(err1) throw err1;
                    res.send({
                        username, 
                        email: results[0].email,
                        role: results[0].role,
                        status: 'Verified'
                    })
                })
            }
            else {
                throw 'User not exist!'
            }
        })
    }
}