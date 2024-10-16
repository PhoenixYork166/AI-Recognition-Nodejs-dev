CREATE TABLE users (
	id SERIAL PRIMARY KEY, 
	name VARCHAR(100) NOT NULL, 
	email TEXT NOT NULL,
	entries bigint,
	joined timestamp without time zone NOT NULL
);