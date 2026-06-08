CREATE TABLE IF NOT EXISTS songs(
   song_id serial PRIMARY KEY,
   song_title VARCHAR (255) NOT NULL,
   song_author VARCHAR (255) NOT NULL
);
