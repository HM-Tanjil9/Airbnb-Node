package app

import (
	config "AuthInGo/config/env"
	"AuthInGo/router"
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
func NewConfig() Config{
	port := config.GetString("PORT", ":8080")
	return Config{
		Addr: port,
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
		Handler: router.SetupRouter(), // Added chi router
		ReadTimeout: 10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	fmt.Println("Starting server on", app.Config.Addr)
	return server.ListenAndServe()
}

