use travelId;

SELECT @@GLOBAL.time_zone, @@SESSION.time_zone;

select * from user;
select * from maskapai;
select * from flight_product;

select fp.id, code, nama, departure_city, arrival_city, tanggal,
	departure_time, arrival_time, departure_terminal, arrival_terminal
    seat_class, harga, jumlah_seat
    from maskapai m
    join flight_product fp
    on m.id = fp.idmaskapai;

