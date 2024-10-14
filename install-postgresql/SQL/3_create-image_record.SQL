CREATE TABLE image_record (
	id serial PRIMARY KEY,
	user_id integer NOT NULL, 
	image_url VARCHAR(255) NOT NULL,
	--metadata VARCHAR(MAX) NOT NULL, 
	metadata JSON NOT NULL,
	date_time timestamp with time zone NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Example INSERT
INSERT INTO image_record (user_id, image_url, metadata, date_time) VALUES (
1,
'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Brad_Pitt_2019_by_Glenn_Francis.jpg/399px-Brad_Pitt_2019_by_Glenn_Francis.jpg',
'{"key1":"keyValue1","key2":"keyValue2"}',
'2024-10-14T12:34:56Z'
);