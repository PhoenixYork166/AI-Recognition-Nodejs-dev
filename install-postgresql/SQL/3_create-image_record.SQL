CREATE TABLE image_record (
	id serial PRIMARY KEY,
	user_id integer NOT NULL, 
	input TEXT NOT NULL,
	metadata JSONB NOT NULL, 
	date_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id)
);
