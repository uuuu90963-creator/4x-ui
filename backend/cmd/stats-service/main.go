package main

import (
	"log"
	"os"
)

func main() {
	log.Println("4X-UI Backend Services")
	log.Println("Note: Backend services are under development")
	log.Printf("Service: %s", os.Getenv("SERVICE_NAME"))
}