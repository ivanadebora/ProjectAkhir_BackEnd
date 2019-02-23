const conn = require('../database');
const moment = require('moment')
const fs = require('fs');
const { uploader } = require('../helpers/uploader');



module.exports = {
    listmaskapai: (req,res) => {
        var sql = 'select * from maskapai;';
        conn.query(sql, (err, results) => {
            if(err) throw err;
            console.log(results);
            res.send(results);
        }) 
    },
    addmaskapai: (req, res) => {
        try {
            const path = '/flights/images';
            const upload = uploader(path, 'FLI').fields([{ name: 'image'}]);
    
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
                
                var sql = 'insert into maskapai set ?;';
                conn.query(sql, data, (err, results) => {
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                    console.log(results);
                    sql = 'select * from maskapai;';
                    conn.query(sql, (err, results1) => {
                        if(err) {
                            console.log(err.message);
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                        }
                        console.log(results1);
                        res.send(results1);
                    })   
                })    
            })
        } catch(err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
    },
    editmaskapai: (req, res) => {
        var maskapaiId = req.params.id;
        var sql = `select * from maskapai where id = ${maskapaiId};`;
        conn.query(sql, (err, results) => {
            if(err) throw err;
    
            if(results.length > 0) {
                const path = '/flights/images';
                const upload = uploader(path, 'FLI').fields([{ name: 'image'}]);
    
                upload(req, res, (err) => {
                    if(err){
                        return res.status(500).json({ message: 'Gagal mengunggah gambar!', error: err.message });
                    }
    
                    const { image } = req.files;
                    const imagePath = image ? path + '/' + image[0].filename : null;
                    const data = JSON.parse(req.body.data);
                    data.image = imagePath;
    
                    try {
                        if(imagePath) {
                            sql = `update maskapai set ? where id = ${maskapaiId};`
                            conn.query(sql,data, (err1,results1) => {
                                if(err1) {
                                    fs.unlinkSync('./public' + imagePath);
                                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                                }
                                fs.unlinkSync('./public' + results[0].image);
                                sql = `select * from maskapai;`;
                                conn.query(sql, (err2,results2) => {
                                    if(err2) {
                                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                                    }
    
                                    res.send(results2);
                                })
                            })
                        }
                        else {
                            sql = `update maskapai set nama='${data.nama}' where id = ${maskapaiId};`
                            conn.query(sql, (err1,results1) => {
                                if(err1) {
                                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                                }
                                sql = `select * from maskapai;`;
                                conn.query(sql, (err2,results2) => {
                                    if(err2) {
                                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                                    }
                                    res.send(results2);
                                })
                            })
                        }
                    }
                    catch(err){
                        console.log(err.message)
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                })
            }
        })
    },
    deletemaskapai: (req, res) => {
        var maskapaiId = req.params.id;
        var sql = `select * from maskapai where id = ${maskapaiId};`;
        conn.query(sql, (err, results) => {
            if(err) {
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            }
            
            if(results.length > 0) {
                sql = `delete from maskapai where id = ${maskapaiId};`
                conn.query(sql, (err1,results1) => {
                    if(err1) {
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                    }
    
                    fs.unlinkSync('./public' + results[0].image);
                    sql = `select * from maskapai;`;
                    conn.query(sql, (err2,results2) => {
                        if(err2) {
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err2.message });
                        }
    
                        res.send(results2);
                    })
                })
            }
        })   
    },
    listproduct: (req, res) => {
        var sql = `select fp.id, code, nama, departure_city, arrival_city, tanggal,
                    departure_time, arrival_time, departure_terminal, arrival_terminal,
                    seat_class, harga, jumlah_seat
                    from maskapai m
                    join flight_product fp
                    on m.id = fp.idmaskapai;`;
        conn.query(sql, (err, results) => {
            if(err) throw err;
            console.log(results);
            res.send(results);
        }) 
    },
    addproduct: (req, res) => {
        var { code, nama, departure_city, arrival_city, tanggal, departure_time, arrival_time,
            departure_terminal, arrival_terminal, seat_class, harga, jumlah_seat, description } = req.body;
        var sql = `select id from maskapai where nama='${nama}';`
        conn.query(sql, (err,results) => {
            if(err) throw err
            console.log(results)
            sql = `insert into flight_product set code='${code}', idmaskapai=${results[0].id}, departure_city='${departure_city}',
                    arrival_city='${arrival_city}', tanggal='${tanggal}', departure_time='${departure_time}', arrival_time='${arrival_time}',
                    departure_terminal='${departure_terminal}', arrival_terminal='${arrival_terminal}', seat_class='${seat_class}',
                    harga=${harga}, jumlah_seat=${jumlah_seat}, description='${description}';`
            conn.query(sql, (err1, results1) => {
                if(err1) throw err1
                console.log(results1)
                sql = `select fp.id, code, nama, departure_city, arrival_city, tanggal
                        departure_time, arrival_time, departure_terminal, arrival_terminal,
                        seat_class, harga, jumlah_seat, description
                        from maskapai m
                        join flight_product fp
                        on m.id = fp.idmaskapai;`;
                conn.query(sql, (err2,results2) => {
                    if(err2) throw err2
                    res.send(results2)
                })
            })
        })
    },
    editproduct: (req,res) => {
        var { code, nama, departure_city, arrival_city, tanggal, departure_time, arrival_time,
            departure_terminal, arrival_terminal, seat_class, harga, jumlah_seat, description } = req.body;
        var sql = `select id from maskapai where nama='${nama}';`;
        conn.query(sql, (err, results) => {
            if(err) throw err
            console.log(results)
            sql = `update flight_product set code='${code}', idmaskapai=${results[0].id}, departure_city='${departure_city}',
                    arrival_city='${arrival_city}', tanggal='${tanggal}', departure_time='${departure_time}', arrival_time='${arrival_time}',
                    departure_terminal='${departure_terminal}', arrival_terminal='${arrival_terminal}', seat_class='${seat_class}',
                    harga=${harga}, jumlah_seat=${jumlah_seat}, description='${description}' where id= ${req.params.id};`;
            conn.query(sql, (err1, results1) => {
                if(err1) throw err1
                console.log(results1)
                sql= `select fp.id, code, nama, departure_city, arrival_city, tanggal
                        departure_time, arrival_time, departure_terminal, arrival_terminal,
                        seat_class, harga, jumlah_seat, description
                        from maskapai m
                        join flight_product fp
                        on m.id = fp.idmaskapai;`; 
                conn.query(sql, (err2, results2) => {
                    if(err2) throw err2
                    res.send(results2)
                })
            })
        })
    },
    deleteproduct: (req, res) => {
        var productId = req.params.id;
        var sql = `select * from flight_product where id = ${productId};`;
        conn.query(sql, (err, results) => {
            if(err) {
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            }
            if(results.length > 0) {
                sql = `delete from flight_product where id = ${productId};`
                conn.query(sql, (err1,results1) => {
                    if(err1) {
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                    }
                    sql = `select fp.id, code, nama, departure_city, arrival_city, tanggal,
                    departure_time, arrival_time, departure_terminal, arrival_terminal,
                    seat_class, harga, jumlah_seat
                    from maskapai m
                    join flight_product fp
                    on m.id = fp.idmaskapai;`;
                    conn.query(sql, (err2,results2) => {
                        if(err2) {
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err2.message });
                        }
                        res.send(results2);
                    })
                })
            }
        })   
    },
    isicart1: (req,res) => {
        var { tanggal, seat_class, qty, username } = req.body;
        var sql = `insert into flight_cart set username='${username}', tanggal = '${tanggal}', 
                    qty=${qty}, seat_class = '${seat_class}';`;
        conn.query(sql, (err,results) => {
            if (err) throw err;
            console.log(results);
            sql = `select * from flight_cart;`;
            conn.query(sql, (err1, results1) => {
                if (err1) throw err1;
                res.send(results1)
            })
        })
    },
    listsearch: (req, res) => {
        var { departure_city, arrival_city, tanggal, seat_class, qty } = req.body;
        var sql = `select fp.id, code, image, nama, departure_city, arrival_city, departure_time, arrival_time, 
                    departure_terminal, arrival_terminal, harga, seat_class, tanggal
                    from maskapai m
                    join flight_product fp
                    on m.id = fp.idmaskapai
                    where departure_city = '${departure_city}' and arrival_city = '${arrival_city}' 
                    and tanggal = '${tanggal}' and seat_class = '${seat_class}' and jumlah_seat >= ${qty};`;
        conn.query(sql, (err,results) => {
            if(err) throw err;
            console.log(results);
            res.send(results);
        })
    },
    listsearch2: (req, res) => {
        var { departure_city, arrival_city, tanggal, seat_class } = req.body;
        var sql = `select fp.id, code, image, nama, departure_city, arrival_city, departure_time, arrival_time, 
                departure_terminal, arrival_terminal, harga, seat_class, tanggal
                from maskapai m
                join flight_product fp
                on m.id = fp.idmaskapai
                where departure_city = '${departure_city}' and arrival_city = '${arrival_city}' 
                and tanggal = '${tanggal}' and seat_class = '${seat_class}'`;
        conn.query(sql, (err,results) => {
            if(err) throw err;
            console.log(results);
            res.send(results);
        })
    },
    isicart2: (req,res) => {
        var { idNya } = req.body
        var sql = `insert into flight_cart set flight_productId = ${idNya};`;
        conn.query(sql, (err,results) => {
            if (err) throw err;
            console.log(results);
            sql = `select * from flight_cart where flight_productId = ${idNya};`;
            conn.query(sql, (err1, results1) => {
                if (err1) throw err1;
                res.send(results1)
            })
        })
    },
    getdetail: (req, res) => {
        var {product_id} = req.body
        console.log(product_id)
        var sql = `select * from flight_product fp
                    join maskapai m 
                    on m.id = fp.idmaskapai
                    where fp.id = ${product_id};`;
        conn.query(sql, (err, results) => {
            if (err) throw err;
            res.send(results)
            console.log(results)
        })
    }
}