package app

import (
	"fmt"
	"net/http"
	"time"
)

// Config holds the configuration for the application
type Config struct {
	Addr string
}

type Application struct {
	Config Config
}

// construct for config
func NewConfig(addr string) Config{
	return Config{
		Addr: addr,
	}
}

// construct for application
func NewApplication(cfg Config) *Application{
	return &Application{
		Config: cfg,
	}
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

