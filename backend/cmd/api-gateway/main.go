package main

import (
	"log"
	"os"
)

func main() {
	log.Println("4X-UI API Gateway")
	log.Println("Note: API Gateway is under development")
	log.Printf("Port: %s", os.Getenv("PORT"))
}