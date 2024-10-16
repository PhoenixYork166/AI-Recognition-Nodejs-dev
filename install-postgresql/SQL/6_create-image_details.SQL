CREATE TABLE image_details (
	ID serial PRIMARY KEY,
	image_id INT NOT NULL, --Assuming `image_record`.`id` INT
	raw_hex VARCHAR(7) NOT NULL, --hex #ffffff
	--value INT NOT NULL, --hex #ffffff
	hex_value VARCHAR(10) NOT NULL,
	w3c_hex VARCHAR(7) NOT NULL,
	w3c_name VARCHAR(50) NOT NULL,
	FOREIGN KEY (image_id) REFERENCES image_record(id)
);