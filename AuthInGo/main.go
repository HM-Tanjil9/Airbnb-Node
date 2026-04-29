package main

import (
	"AuthInGo/app"
	config "AuthInGo/config/db"
)

func main() {
	cfg := app.NewConfig()
	app := app.NewApplication(cfg)
	config.SetupDB()
	app.Run()
}
