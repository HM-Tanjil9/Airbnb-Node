package app

import (
	dbConfig "AuthInGo/config/db"
	config "AuthInGo/config/env"
	"AuthInGo/controllers"
	repo "AuthInGo/db/repositories"
	"AuthInGo/router"
	"AuthInGo/services"
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
func NewConfig() Config {
	port := config.GetString("PORT", ":8080")
	return Config{
		Addr: port,
	}
}

// construct for application
func NewApplication(cfg Config) *Application {
	return &Application{
		Config: cfg,
	}
}

func (app *Application) Run() error {
	db, err := dbConfig.SetupDB()
	if err != nil {
		println("Error setting up database:", err)
		return err
	}
	ur := repo.NewUserRepository(db)
	us := services.NewUserService(ur)
	uc := controllers.NewUserController(us)
	uRouter := router.NewUserRouter(uc)

	server := &http.Server{
		Addr:         app.Config.Addr,
		Handler:      router.SetupRouter(uRouter), // Added chi router
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	fmt.Println("Starting server on", app.Config.Addr)
	return server.ListenAndServe()
}
