package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"os"
)

type Song struct {
	ID     int    `json:"id"`
	Author string `json:"author"`
	Title  string `json:"title"`
}

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) GetPeople() ([]Song, error) {
	data, err := os.ReadFile("test.json")
	if err != nil {
		return nil, err
	}

	var people []Song
	err = json.Unmarshal(data, &people)
	if err != nil {
		return nil, err
	}

	return people, nil
}

func (a *App) GetMusic() (string, error) {
	data, err := os.ReadFile("solevar.ogg");
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(data), nil;
}
