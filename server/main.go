package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/dhowden/tag"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

//
// Global
//

var db *sql.DB

func handleError(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

//
// DB
//

/*
func insert() {
	sqlStatement := `INSERT INTO songs (song_title, song_author)
	VALUES ($1, $2)`
	title, author := parseSong()
	_, err := db.Exec(sqlStatement, title, author)
	handleError(err)
}
*/

func dbConn() {
	err := godotenv.Load()
	handleError(err)

	host := os.Getenv("HOST")
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	user := os.Getenv("USER")
	password := os.Getenv("PASSWORD")
	dbname := os.Getenv("DBNAME")

	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	var openErr error
	db, openErr = sql.Open("postgres", psqlInfo)
	handleError(openErr)

	err = db.Ping()
	handleError(err)
}

//
// Song Parser
//

// Temporiary
func iterateAllSongs() {
	d, err := os.ReadDir("./songs")
	handleError(err)
	for _, entry := range d {
		if entry.IsDir() {
			continue
		}

		f, err := os.Open("./songs/" + entry.Name())
		handleError(err)
		defer f.Close()

		fmt.Println(entry.Name())
	}
}

func parseSong(f *os.File) (string, string) {
	meta, err := tag.ReadFrom(f)
	handleError(err)

	title := meta.Title()
	artist := meta.Artist()

	return title, artist
}

//
// HTTP
//

type Song struct {
	ID     int    `json:"song_id"`
	Title  string `json:"song_title"`
	Author string `json:"song_author"`
}

func songsHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT song_id, song_title, song_author FROM songs")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var songs []Song

	for rows.Next() {
		var s Song

		if err := rows.Scan(&s.ID, &s.Title, &s.Author); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		songs = append(songs, s)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(songs)
}

func httpServer() {
	http.HandleFunc("/songs", songsHandler)

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

//
//
//

func main() {
	dbConn()
	defer db.Close()
	iterateAllSongs()
	httpServer()
}
