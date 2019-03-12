const conn = require('../database')
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
    listkota: (req, res) => {
        var sql = `select nama_kota from flight_kota order by nama_kota;`
        conn.query(sql, (err, results) => {
            if(err) throw err;
            res.send(results);
        })
    },
    listairport: (req,res) => {
        var sql = `select nama_bandara from flight_kota;`
        conn.query(sql, (err, results) => {
            if(err) throw err;
            res.send(results);
        })
    },
    listproduct: (req, res) => {
        var sql = `select fp.id, code, nama, departure_city, arrival_city, tanggal,
                    departure_time, arrival_time, departure_terminal, arrival_terminal,
                    seat_class, harga, jumlah_seat, departure_airport, arrival_airport, status_product
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
        var { code, nama, departure_city, arrival_city, tanggal, departure_time, arrival_time, departure_airport, arrival_airport,
            departure_terminal, arrival_terminal, seat_class, harga, jumlah_seat, description, status_product } = req.body;
        var sql = `select id from maskapai where nama='${nama}';`
        conn.query(sql, (err,results) => {
            if(err) throw err
            console.log(results)
            sql = `insert into flight_product set code='${code}', idmaskapai=${results[0].id}, departure_city='${departure_city}',
                    arrival_city='${arrival_city}', tanggal='${tanggal}', departure_time='${departure_time}', arrival_time='${arrival_time}',
                    departure_airport='${departure_airport}', arrival_airport='${arrival_airport}',
                    departure_terminal='${departure_terminal}', arrival_terminal='${arrival_terminal}', seat_class='${seat_class}',
                    harga=${harga}, jumlah_seat=${jumlah_seat}, description='${description}', status_product='${status_product}';`
            conn.query(sql, (err1, results1) => {
                if(err1) throw err1
                console.log(results1)
                sql = `select fp.id, code, nama, departure_city, arrival_city, tanggal, departure_airport, arrival_airport,
                        departure_time, arrival_time, departure_terminal, arrival_terminal,
                        seat_class, harga, jumlah_seat, description, status_product
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
        var { code, nama, departure_city, arrival_city, tanggal, departure_time, arrival_time, departure_airport, arrival_airport,
            departure_terminal, arrival_terminal, seat_class, harga, jumlah_seat, description, status_product } = req.body;
        var sql = `select id from maskapai where nama='${nama}';`;
        conn.query(sql, (err, results) => {
            if(err) throw err
            console.log(results)
            sql = `update flight_product set code='${code}', idmaskapai=${results[0].id}, departure_city='${departure_city}',
                    arrival_city='${arrival_city}', tanggal='${tanggal}', departure_time='${departure_time}', arrival_time='${arrival_time}',
                    departure_airport='${departure_airport}', arrival_airport='${arrival_airport}',
                    departure_terminal='${departure_terminal}', arrival_terminal='${arrival_terminal}', seat_class='${seat_class}',
                    harga=${harga}, jumlah_seat=${jumlah_seat}, description='${description}', status_product='${status_product}' where id= ${req.params.id};`;
            conn.query(sql, (err1, results1) => {
                if(err1) throw err1
                console.log(results1)
                sql= `select fp.id, code, nama, departure_city, arrival_city, tanggal, departure_airport, arrival_airport,
                        departure_time, arrival_time, departure_terminal, arrival_terminal,
                        seat_class, harga, jumlah_seat, description, status_product
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
    }
}