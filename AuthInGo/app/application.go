package app

import (
	"fmt"
	"net/http"
	"time"
)

// Config holds the configuration for the server
type Config struct {
	Addr string
}

type Application struct {
	Config Config
}

func (app *Application) Run() error {
	server := &http.Server{
		Addr: app.Config.Addr,
		Handler: nil, // TODO: Added chi router
		ReadTimeout: 10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	fmt.Println("Starting server on", app.Config.Addr)
	return server.ListenAndServe()
}

