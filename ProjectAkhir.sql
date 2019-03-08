use travelId;

SELECT @@GLOBAL.time_zone, @@SESSION.time_zone;
truncate table flight_cart;
truncate table flight_passenger;
truncate table flight_transaction;

select * from user;
select * from maskapai;
select * from flight_product;
select * from flight_cart;
select * from flight_passenger;
select * from flight_transaction;

select image, nama, departure_city, arrival_city, departure_time, arrival_time, 
	departure_terminal, arrival_terminal, harga
    from maskapai m
    join flight_product fp
    on m.id = fp.idmaskapai
    where departure_city = 'Jakarta' && arrival_city = 'Surabaya' && 
    tanggal = '2019-02-25' && seat_class='Ekonomi' && jumlah_seat >=4;

select fp.id, code, nama, departure_city, arrival_city, tanggal,
	departure_time, arrival_time, departure_terminal, arrival_terminal
    seat_class, harga, jumlah_seat
    from maskapai m
    join flight_product fp
    on m.id = fp.idmaskapai;


select fp.id, code, image, nama, departure_city, arrival_city, departure_time, arrival_time, 
                departure_terminal, arrival_terminal, harga
                from maskapai m
                join flight_product fp
                on m.id = fp.idmaskapai
                where departure_city = 'Jakarta' and arrival_city = 'Bali' 
                and tanggal = '2019-02-25' and seat_class = 'Ekonomi' and jumlah_seat >= 4;
                
select * from flight_product fp
                    join maskapai m 
                    on m.id = fp.idmaskapai
                    where fp.id = 3;

delete from flight_transaction where id = 2;

select nama_kota from flight_kota order by nama_kota;