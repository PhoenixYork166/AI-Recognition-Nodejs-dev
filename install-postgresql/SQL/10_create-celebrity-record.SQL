CREATE TABLE celebrity_record (
	id serial PRIMARY KEY,
	user_id integer NOT NULL, 
    celebrity_name VARCHAR(100) NOT NULL,
	image_url VARCHAR(255) NOT NULL,
	image_blob TEXT NOT NULL,
    metadata TEXT NOT NULL, 
	date_time timestamp with time zone NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id)
);