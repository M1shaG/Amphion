package main

import (
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

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

func insert(title string, author string) {
	sqlStatement := `INSERT INTO songs (song_title, song_author)
	VALUES ($1, $2)`

	_, err := db.Exec(sqlStatement, title, author)
	handleError(err)
}

func dbConn() {
	err := godotenv.Load()
	handleError(err)

	host := os.Getenv("HOST")
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	user := os.Getenv("DB_USER")
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
	i := 1
	d, err := os.ReadDir("./songs")
	handleError(err)
	for _, entry := range d {
		if entry.IsDir() {
			continue
		}

		oldPath := filepath.Join("./songs", entry.Name())
		newPath := fmt.Sprintf("./db_songs/%d.ogg", i)

		err := copyFile(oldPath, newPath)
		handleError(err)

		author, title := parseSong(entry.Name())
		insert(title, author)
		i++

	}
}

func copyFile(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()

	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, in)
	return err
}

func parseSong(filename string) (string, string) {
	if i := strings.Index(filename, "["); i != -1 {
		filename = strings.TrimSpace(filename[:i])
		fmt.Println(filename)
	}

	parts := strings.SplitN(filename, "-", 2)

	if len(parts) != 2 {
		fmt.Println("invalid parts")
		return "", ""
	}

	return parts[0], parts[1]
}

//
// HTTP
//

type Song struct {
	ID     int    `json:"song_id"`
	Title  string `json:"song_title"`
	Author string `json:"song_author"`
}

func songsPlayHandler(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "missing id", http.StatusBadRequest)
		return
	}

	path := filepath.Join("./db_songs", id+".ogg")
	if _, err := os.Stat(path); os.IsNotExist(err) {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "audio/ogg")
	http.ServeFile(w, r, path)
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
	http.HandleFunc("/songs/play", songsPlayHandler)

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

//
//
//

func main() {
	parseFlag := flag.Bool("p", false, "a bool")

	flag.Parse()

	dbConn()
	defer db.Close()
	if *parseFlag {
		iterateAllSongs()
	} else {
		httpServer()
	}
}
