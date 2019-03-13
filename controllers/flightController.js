const moment = require('moment')
const conn = require('../database')
const fs = require('fs');
const { uploader } = require('../helpers/uploader');
const transporter = require('../helpers/pengirimemail');



module.exports = {
    listkota: (req, res) => {
        var sql = `select nama_kota from flight_kota order by nama_kota;`
        conn.query(sql, (err, results) => {
            if(err) throw err;
            res.send(results);
        })
    },
    listmaskapai: (req,res) => {
        var sql = 'select * from maskapai;';
        conn.query(sql, (err, results) => {
            if(err) throw err;
            console.log(results);
            res.send(results);
        }) 
    },
    listsearch: (req, res) => {
        var { departure_city, arrival_city, tanggal, seat_class, qty } = req.body;
        var sql = `select fp.id, code, image, nama, departure_city, arrival_city, departure_time, arrival_time, description,
                    departure_terminal, arrival_terminal, harga, seat_class, tanggal, departure_airport, arrival_airport
                    from maskapai m
                    join flight_product fp
                    on m.id = fp.idmaskapai
                    where departure_city = '${departure_city}' and arrival_city = '${arrival_city}' 
                    and tanggal = '${tanggal}' and seat_class = '${seat_class}' and jumlah_seat >= ${qty} and status_product='Available';`;
        conn.query(sql, (err,results) => {
            if(err) throw err;
            console.log(results);
            res.send(results);
        })
    },
    listsearchmaxprice: (req, res) => {
        var { departure_city, arrival_city, tanggal, seat_class, qty } = req.body;
        var sql = `select fp.id, code, image, nama, departure_city, arrival_city, departure_time, arrival_time, description,
                    departure_terminal, arrival_terminal, harga, seat_class, tanggal, departure_airport, arrival_airport
                    from maskapai m
                    join flight_product fp
                    on m.id = fp.idmaskapai
                    where departure_city = '${departure_city}' and arrival_city = '${arrival_city}' 
                    and tanggal = '${tanggal}' and seat_class = '${seat_class}' and jumlah_seat >= ${qty} and status_product='Available' order by harga desc;`;
        conn.query(sql, (err, results) => {
            if(err) throw err;
            console.log(results);
            res.send(results);
        })             
    },
    listsearchminprice: (req, res) => {
        var { departure_city, arrival_city, tanggal, seat_class, qty } = req.body;
        var sql = `select fp.id, code, image, nama, departure_city, arrival_city, departure_time, arrival_time, description,
                    departure_terminal, arrival_terminal, harga, seat_class, tanggal, departure_airport, arrival_airport
                    from maskapai m
                    join flight_product fp
                    on m.id = fp.idmaskapai
                    where departure_city = '${departure_city}' and arrival_city = '${arrival_city}' 
                    and tanggal = '${tanggal}' and seat_class = '${seat_class}' and jumlah_seat >= ${qty} and status_product='Available' order by harga;`;
        conn.query(sql, (err, results) => {
            if(err) throw err;
            console.log(results);
            res.send(results);
        })             
    },
    listsearchtimeawal: (req, res) => {
        var { departure_city, arrival_city, tanggal, seat_class, qty } = req.body;
        var sql = `select fp.id, code, image, nama, departure_city, arrival_city, departure_time, arrival_time, description,
                    departure_terminal, arrival_terminal, harga, seat_class, tanggal, departure_airport, arrival_airport
                    from maskapai m
                    join flight_product fp
                    on m.id = fp.idmaskapai
                    where departure_city = '${departure_city}' and arrival_city = '${arrival_city}' 
                    and tanggal = '${tanggal}' and seat_class = '${seat_class}' and jumlah_seat >= ${qty} and status_product='Available' order by departure_time;`;
        conn.query(sql, (err, results) => {
            if(err) throw err;
            console.log(results);
            res.send(results);
        })             
    },
    listsearchtimeakhir: (req, res) => {
        var { departure_city, arrival_city, tanggal, seat_class, qty } = req.body;
        var sql = `select fp.id, code, image, nama, departure_city, arrival_city, departure_time, arrival_time, description,
                    departure_terminal, arrival_terminal, harga, seat_class, tanggal, departure_airport, arrival_airport
                    from maskapai m
                    join flight_product fp
                    on m.id = fp.idmaskapai
                    where departure_city = '${departure_city}' and arrival_city = '${arrival_city}' 
                    and tanggal = '${tanggal}' and seat_class = '${seat_class}' and jumlah_seat >= ${qty} and status_product='Available' order by departure_time desc;`;
        conn.query(sql, (err, results) => {
            if(err) throw err;
            console.log(results);
            res.send(results);
        })             
    },
    getdetail: (req, res) => {
        var {product_id} = req.body
        console.log(product_id)
        var sql = `select fp.id, nama, code, image, tanggal, departure_city, departure_time, departure_terminal,
                    arrival_city, arrival_time, arrival_terminal, seat_class,  departure_airport, arrival_airport,
                    harga, description 
                    from flight_product fp
                    join maskapai m 
                    on m.id = fp.idmaskapai
                    where fp.id = ${product_id};`;
        conn.query(sql, (err, results) => {
            if (err) throw err;
            res.send(results)
            console.log(results)
        })
    },
    isicart: (req,res) => {
        var { username, tanggal_pesan, flight_productId, nama, image, code, seat_class, harga, qty, total_harga, tanggal, 
            departure_city, departure_time, departure_terminal, arrival_city, arrival_time, arrival_terminal,
            departure_airport, arrival_airport, description
        } = req.body
        var sql = `insert into flight_cart set username='${username}', tanggal_pesan = '${moment(tanggal_pesan).format('YYYY-MM-DD, h:mm:ss')}', flight_productId = ${flight_productId},
                    nama='${nama}', image='${image}', code='${code}', seat_class='${seat_class}', harga=${harga}, qty=${qty}, total_harga=${total_harga},
                    departure_city='${departure_city}', arrival_city='${arrival_city}', tanggal='${moment(tanggal).format('YYYY-MM-DD')}',
                    departure_time='${departure_time}', arrival_time='${arrival_time}', departure_terminal = '${departure_terminal}',
                    arrival_terminal = '${arrival_terminal}', departure_airport='${departure_airport}', arrival_airport='${arrival_airport}', description='${description}';`;
        conn.query(sql, (err,results) => {
            if (err) throw err;
            console.log(results);
            console.log('Success adding product to cart!')
            sql = `select * from flight_cart;`;
            conn.query(sql, (err1, results1) => {
                if (err1) throw err1;
                console.log(results1)
                res.send(results1)
            })
        })
    },
    addpassenger: (req,res) => {
        var dataPassenger = { 
            id_pesanan: req.body.id_pesanan, 
            passenger1: req.body.passenger1, 
            passenger2: req.body.passenger2, 
            passenger3: req.body.passenger3, 
            passenger4: req.body.passenger4, 
            passenger5: req.body.passenger5,
            ktp1: req.body.ktp1, 
            ktp2: req.body.ktp2, 
            ktp3: req.body.ktp3, 
            ktp4: req.body.ktp4, 
            ktp5: req.body.ktp5
        }
        var sql = `insert into flight_passenger set ?`;
        conn.query(sql, dataPassenger, (err, results) => {
            if (err) throw err;
            console.log(results);
            res.send('Success!')
        })
    },
    lihatcart: (req,res) => {
        var sql = `select * from flight_cart where username='${req.body.username}' order by tanggal_pesan desc;`;
        conn.query(sql, (err,results) => {
            if (err) throw err;
            res.send(results)
        })
    },
    lihatcartdetail: (req,res) => {
        var sql = `select * from flight_cart where username='${req.body.username}' and id = ${req.body.id};`
        conn.query(sql, (err,results) => {
            if (err) throw err;
            res.send(results)
        })
    },
    listpassengercart: (req,res) => {
        var sql = `select * from flight_passenger where id_pesanan=${req.body.id};`
        conn.query(sql, (err,results) => {
            if (err) throw err;
            res.send(results)
        })
    },
    addtransaction: (req,res) => {
        try {
            const path = '/flights/paidConfirmation/images';
            const upload = uploader(path, 'FPC').fields([{ name: 'image'}]);
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ message: 'Gagal mengunggah gambar!', error: err.message });
                }
    
                const { image } = req.files;
                console.log(image)
                const imagePath = image ? path + '/' + image[0].filename : null;
                console.log(imagePath)
    
                console.log(req.body.data)
                const data = JSON.parse(req.body.data);
                console.log(data)
                data.image = imagePath;
                
                var sql = `insert into flight_transaction set ?;`;
                conn.query(sql, data, (err, results) => {
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                    console.log(results);
                    res.send(results) 
                })
                     
            })
        } catch(err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
    },
    updatepassenger: (req, res) => {
        var { id_pesanan, id_transaksi} = req.body;
        var sql = `update flight_passenger set id_transaksi=${id_transaksi} where id_pesanan=${id_pesanan};`;
        conn.query(sql, (err,results) => {
            if (err) throw err
            res.send(results)
        })
    },
    deletecart: (req, res) => {
        var { id, username, flight_productId } = req.body;
        var sql = `select qty from flight_cart where id=${id} and username='${username}';`;
        conn.query(sql, (err,results) => {
            if (err) throw err
            console.log(results)
            var jumlah_penumpang = results[0].qty;
            sql = `select jumlah_seat from flight_product where id=${flight_productId};`;
            conn.query(sql, (err1, results1) => {
                if (err1) throw err1
                console.log(results1)
                var jumlah_stock = results1[0].jumlah_seat;
                var sisa_stock = (jumlah_stock - jumlah_penumpang)
                console.log(sisa_stock)
                sql = `update flight_product set jumlah_seat=${sisa_stock} where id=${flight_productId}`
                conn.query(sql, (err2, results2) => {
                    if (err2) throw err2
                    console.log(results2)
                    console.log(id)
                    sql = `delete from flight_cart where id=${id};`
                    conn.query(sql, (err3, results3) => {
                        if (err3) throw err3
                        console.log(results3)
                    })
                })
            })
        })
        var sql = `delete from flight_cart where id=${id} and username='${username}';`;
        conn.query(sql,(err, results) => {
            if (err) throw err
            res.send(results)
        })
    },
    listhistory: (req,res) => {
        var sql = `select * from flight_transaction where username='${req.body.username}' order by tanggal_konfirmasi desc;`
        conn.query(sql, (err,results) => {
            if (err) throw err
            res.send(results)
        })
    },
    listhistorydetail: (req,res) => {
        var sql = `select * from flight_transaction where username='${req.body.username}' and id = ${req.body.id};`
        conn.query(sql, (err,results) => {
            if (err) throw err;
            res.send(results)
        })
    },
    listpassengerhistory: (req,res) => {
        var sql = `select * from flight_passenger where id_transaksi=${req.body.id};`
        conn.query(sql, (err,results) => {
            if (err) throw err;
            res.send(results)
        })
    }
}
